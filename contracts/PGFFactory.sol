//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./FundingContract.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract PGFFactory is
    AccessControlEnumerableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    // State Variable
    uint256 public s_creationFee;
    address public s_payoutAddress;
    uint256 public s_fundingId;
    mapping(uint => address) private s_fundingIdToAddress;
    uint256 public s_contractBalance;

    // Constant variables
    bytes32 public constant PAYOUTADDRESS_ROLE =
        keccak256("PAYOUTADDRESS_ROLE");
    bytes32 public constant CREATIONFEE_ROLE = keccak256("CREATIONFEE_ROLE");

    // Events
    event FundingCreated(
        address indexed contractAddress,
        uint256 indexed totalFunding,
        uint256 indexed vestingPeriod,
        uint256 withdrawalFee
    );

    event Withdrawed(address indexed payoutAddress, uint256 indexed amount);

    event CreationFeeChanged(uint256 indexed newCreationFee);

    event PayoutAddressChanged(address indexed newPayoutAddress);

    // Modifiers
    modifier isEnoughEther() {
        require(
            msg.value >= s_creationFee,
            "Ether sent should be equal or more than creation fees"
        );
        _;
    }

    function initialize(
        uint256 _creationFee,
        address _payoutAddress
    ) public initializer {
        s_creationFee = _creationFee;
        s_payoutAddress = _payoutAddress;
        s_fundingId = 0;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function _authorizeUpgrade(
        address
    ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    // External Function
    function createFunding(
        uint256 _totalFunding,
        uint256 _withdrawalFee,
        bool _isGroupWithdrawal,
        string memory _tokenUri,
        uint64 _startTimestamp,
        uint64 _vestingPeriodInSeconds
    ) external payable isEnoughEther {
        FundingContract fundingContract = new FundingContract(
            _totalFunding,
            _withdrawalFee,
            _isGroupWithdrawal,
            _tokenUri,
            _startTimestamp,
            _vestingPeriodInSeconds
        );
        s_fundingIdToAddress[s_fundingId] = address(fundingContract);
        s_fundingId++;
        s_contractBalance += msg.value;
        emit FundingCreated(
            address(fundingContract),
            _totalFunding,
            _vestingPeriod,
            _withdrawalFee
        );
    }

    function withdraw() external nonReentrant {
        address payoutAddress = s_payoutAddress;
        uint256 contractBalance = s_contractBalance;
        (bool success, ) = payable(payoutAddress).call{value: contractBalance}(
            ""
        );
        require(success, "Withdraw not successfull");
        s_contractBalance = 0;
        emit Withdrawed(payoutAddress, contractBalance);
    }

    // Setter Functions
    function setCreationFee(
        uint256 _creationFee
    ) external onlyRole(CREATIONFEE_ROLE) {
        s_creationFee = _creationFee;
        emit CreationFeeChanged(_creationFee);
    }

    function setPayoutAddress(
        address _payoutAddress
    ) external onlyRole(PAYOUTADDRESS_ROLE) {
        require(_payoutAddress != address(0), "Address cant be zero");
        s_payoutAddress = _payoutAddress;
        emit PayoutAddressChanged(_payoutAddress);
    }

    // View Functions
    function getAddress(uint256 _fundingId) external view returns (address) {
        return s_fundingIdToAddress[_fundingId];
    }
}
