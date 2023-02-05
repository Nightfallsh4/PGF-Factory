//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


error FundingContract__TransferFailed();
error FundingContract__NotEnoughETH();
error FundingContract__NotGroupFunding();

contract FundingContract is ERC721, Ownable {

    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _withdrawers;

    uint256 private s_totalAmount;
    uint256 private s_withdrawalFee;
    uint256 private s_vestingPeriod;
    bool private _isGroupWithdrawal;

    mapping(address => uint256) private s_addressToAmountFunded;
    address[] s_funders;

    mapping(uint256 => mapping(address => bool)) private s_requestForWithdrawal; 

    

    modifier onlyGroupFunding() {
        if(!_isGroupWithdrawal){
            revert FundingContract__NotGroupFunding();
        }
       _;
    }

    constructor(
        uint256 totalFunding,
        uint256 withdrawalFee,
        uint256 vestingPeriod,
        bool isGroupWithdrawal
    ) ERC721('FundingContractToken', 'FCT'){

        s_totalAmount = totalFunding;
        s_withdrawalFee = withdrawalFee;
        s_vestingPeriod = vestingPeriod;
        _isGroupWithdrawal = isGroupWithdrawal;
    }



    function depositFunds() public payable{
        
        uint256 minFundingAmount = getMinimumFundingAmount();
        uint256 currentTokenId = _tokenIds.current();

        if(msg.value <= minFundingAmount){
            revert FundingContract__NotEnoughETH();
        }
        s_addressToAmountFunded[msg.sender] = msg.value;
        s_funders.push(msg.sender);
        _safeMint(msg.sender, currentTokenId);
        _tokenIds.increment();
        

    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        /**
         *  TODO 
         * 
         */
    }

    function claim() public {
        /**
         * TODO
         * 
         */
    }

    function requestForWithdrawal(uint256 tokenId) public onlyGroupFunding {
        s_requestForWithdrawal[tokenId][msg.sender] = true;
        _withdrawers.increment();
    }

    // Receive any funds sent to the contract
    receive() external payable {}

    function withdrawalCheck() public onlyGroupFunding returns(bool){
        uint256 numberOfWithdrawers = _withdrawers.current();
        uint256 withdrawalLimit = s_funders.length.mul(60).div(100);
        if(numberOfWithdrawers >= withdrawalLimit){
            return true;
        }
        return false;
    }



    function withdrawFunds() public onlyOwner{
        if(_isGroupWithdrawal){
            require(withdrawalCheck(), 'There is no majority approval to withdraw');
        }
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value:amount}("");
        if(!success){
            revert FundingContract__TransferFailed();
        }
    }

    function getMinimumFundingAmount() public view returns(uint256){
        return s_totalAmount.div(s_vestingPeriod);
    }

    function getTotalAmount() public view returns(uint256){
        return s_totalAmount;
    }


    function getWithdrawalFee() public view returns(uint256){
        return s_withdrawalFee;
    }

    function getVestingPeriod() public view returns(uint256){
        return s_vestingPeriod;
    }

    function getIsGroupWithdrawal() public view returns(bool){
        return _isGroupWithdrawal;
    }

    function getAddressToAmountFunded(address funder) public view returns(uint256){
        return s_addressToAmountFunded[funder];
    }

    function getFunder(uint256 index) public view returns(address){
        return s_funders[index];
    }



}