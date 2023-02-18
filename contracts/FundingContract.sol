//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/finance/VestingWallet.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";

error FundingContract__TransferFailed();
error FundingContract__NotEnoughETH();
error FundingContract__NotGroupFunding();

contract FundingContract is ERC721, AccessControl, VestingWallet {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _withdrawers;

    //Merkle Tree Addition

    // Constant variables
    bytes32 public constant FUNDER_ROLE = keccak256("FUNDER_ROLE");
    bytes32 public constant CONTRACTOR_ROLE = keccak256("CONTRACTOR_ROLE");

    //Events
    event FundsDeposited(
        uint256 indexed tokenId,
        address indexed funder,
        uint256 indexed amount
    );
    event ContractorClaimedFunds(
        address indexed contractor,
        uint256 indexed releasedFunds
    );
    event WithdrawalRequest(
        uint256 indexed tokenId,
        address indexed withdrawer
    );
    event FundsWithdrawed(
        address indexed withdrawer,
        uint256 indexed withDrawedFunds
    );

    uint256 private immutable s_totalAmount;
    uint256 private immutable s_withdrawalFee; // In BPS
    bool private immutable _isGroupWithdrawal;
    uint256 private s_startTimestamp;
    uint256 public s_totalFundedAmount;
    uint256 public s_feeFromWithdrawal;
    string private _tokenURI;
    bytes32 private _merkleRoot;

    mapping(address => uint256) private s_addressToAmountFunded;
    address[] s_funders;

    mapping(uint256 => mapping(address => bool)) private s_requestForWithdrawal;

    modifier onlyGroupFunding() {
        if (!_isGroupWithdrawal) {
            revert FundingContract__NotGroupFunding();
        }
        _;
    }

    constructor(
        uint256 totalFunding,
        uint256 withdrawalFee,
        bool isGroupWithdrawal,
        string memory tokenUri,
        uint64 startTimestamp,
        uint64 vestingPeriodInSeconds,
        bytes32 merkleRoot
    )
        ERC721("FundingContractToken", "FCT")
        VestingWallet(msg.sender, startTimestamp, vestingPeriodInSeconds)
    {
        s_totalAmount = totalFunding;
        s_withdrawalFee = withdrawalFee;
        _isGroupWithdrawal = isGroupWithdrawal;
        s_startTimestamp = startTimestamp;
        _tokenURI = tokenUri;
        _merkleRoot = merkleRoot;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function depositFunds(bytes32[] calldata merkleProof) public payable {
        //check if the funding is greater than totalAmount
        uint256 minFundingAmount = getMinimumFundingAmount();
        uint256 currentTokenId = _tokenIds.current();

        if (msg.value <= minFundingAmount) {
            revert FundingContract__NotEnoughETH();
        }
        s_addressToAmountFunded[msg.sender] = msg.value;
        s_totalFundedAmount += msg.value;
        s_funders.push(msg.sender);
        verifyMerkleTree(merkleProof, _merkleRoot);
        _safeMint(msg.sender, currentTokenId);
        _tokenIds.increment();

        emit FundsDeposited(currentTokenId, msg.sender, msg.value);
    }

    function tokenURI(
        uint256 /*tokenId*/
    ) public view virtual override returns (string memory) {
        return _tokenURI;
    }

    function claim() public onlyRole(CONTRACTOR_ROLE) {
        require(
            released() != s_totalAmount,
            "You have claimed the entire amount"
        );
        require(releasable() >= 0, "You do not have releasable funds");

        release();

        emit ContractorClaimedFunds(msg.sender, released());
    }

    function requestForWithdrawal(uint256 tokenId) public onlyGroupFunding {
        s_requestForWithdrawal[tokenId][msg.sender] = true;
        _withdrawers.increment();

        emit WithdrawalRequest(tokenId, msg.sender);
    }

    // Receive any funds sent to the contract
    receive() external payable override {}

    function withdrawalCheck() public view onlyGroupFunding returns (bool) {
        uint256 numberOfWithdrawers = _withdrawers.current();
        uint256 withdrawalLimit = s_funders.length.mul(60).div(100);
        if (numberOfWithdrawers >= withdrawalLimit) {
            return true;
        }
        return false;
    }

    function withdrawFunds() public onlyRole(FUNDER_ROLE) {
        if (_isGroupWithdrawal) {
            require(
                withdrawalCheck(),
                "There is no majority approval to withdraw"
            );
        }
        uint64 currentTimeStamp = uint64(block.timestamp - start());
        require(currentTimeStamp <= duration());
        uint256 vestedAmount = vestedAmount(uint64(block.timestamp));
        // console.log("Vested Amount ", vestedAmount);

        uint256 totalFundedAmount = s_totalFundedAmount;
        // console.log("Total funded Amount ", totalFundedAmount);

        uint256 senderAmount = s_addressToAmountFunded[msg.sender];
        // console.log("Sender Amount ", senderAmount);

        uint256 netAmount = totalFundedAmount - vestedAmount;
        // console.log("Net Amount ", netAmount);

        uint256 amountBeforeFee = (netAmount * senderAmount) /
            totalFundedAmount;

        // console.log("Amount Before Fee ", amountBeforeFee);

        uint256 withdrawFee = (amountBeforeFee * s_withdrawalFee) / 10000;
        // console.log("Withdrawal Fee ", s_withdrawalFee);
        // console.log("Withdraw Fee ", withdrawFee);
        uint256 amount = amountBeforeFee - withdrawFee;
        // console.log("Amount ", amount);
        // (bool success, ) = payable(msg.sender).call{value: amount}("");
        // if (!success) {
        //     revert FundingContract__TransferFailed();
        // }
        // uint256 amount = address(this).balance - releasable();
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert FundingContract__TransferFailed();
        }
        emit FundsWithdrawed(msg.sender, amount);
    }

    function verifyMerkleTree(
        bytes32[] calldata proof,
        bytes32 root
    ) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        return MerkleProof.verify(proof, root, leaf);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function getMinimumFundingAmount() public view returns (uint256) {
        uint256 vestingPeriodInSeconds = duration();
        uint256 secondsToMonths = 60 * 60 * 24 * 30;
        uint256 vestingPeriodToMonth = vestingPeriodInSeconds.div(
            secondsToMonths
        );
        return s_totalAmount.div(vestingPeriodToMonth);
    }

    function getTotalAmount() public view returns (uint256) {
        return s_totalAmount;
    }

    function getWithdrawalFee() public view returns (uint256) {
        return s_withdrawalFee;
    }

    function getVestingPeriod() public view returns (uint256) {
        return duration();
    }

    function getStartTimestamp() public view returns (uint256) {
        return s_startTimestamp;
    }

    function getIsGroupWithdrawal() public view returns (bool) {
        return _isGroupWithdrawal;
    }

    function getAmountFundedByAddress(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getTotalFunders() public view returns (uint256) {
        return s_funders.length;
    }

    function getTokenCounter() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getWithdrawerCounter() public view returns (uint256) {
        return _withdrawers.current();
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
