//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./FundingContract.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";


contract PGFFactory is AccessControlEnumerableUpgradeable, ReentrancyGuardUpgradeable {

    // State Variable
    uint256 public s_creationFee;
    address public s_payoutAddress;
    uint256 public s_fundingId;
    mapping(uint => address) private s_fundingIdToAddress;
    uint256 public s_contractBalance;
    
    // Constant variables
    bytes32 public constant PAYOUTADDRESS_ROLE = keccak256("PAYOUTADDRESS_ROLE");
    bytes32 public constant CREATIONFEE_ROLE = keccak256("CREATIONFEE_ROLE");



    // Modifiers
    modifier isEnoughEther() {
        require(msg.value>= s_creationFee,"Ether sent should be equal or more than creation fees");
        _;
    }

   function initialize(uint256 _creationFee, address _payoutAddress) initializer public {
        s_creationFee = _creationFee;
        s_payoutAddress = _payoutAddress;
        s_fundingId = 0;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // External Function
    function createFunding(uint256 totalFunding, uint256 withdrawalFee, uint256 vestingPeriod,bool isGroupWithdrawal) external payable isEnoughEther {
        FundingContract fundingContract = new FundingContract(totalFunding,withdrawalFee,vestingPeriod,isGroupWithdrawal);
        s_fundingIdToAddress[s_fundingId] = address(fundingContract);
        s_fundingId++;
        s_contractBalance += msg.value;
    }

    function withdraw() external nonReentrant {
        (bool success, ) = payable(s_payoutAddress).call{value:s_contractBalance}("");
        require(success,"Withdraw not successfull");
        s_contractBalance = 0;
    }

    // Setter Functions
    function setCreationFee(uint256 _creationFee) external onlyRole(CREATIONFEE_ROLE) {
        s_creationFee = _creationFee;
    }

    function setPayoutAddress(address _payoutAddress) external onlyRole(PAYOUTADDRESS_ROLE) {
        require(_payoutAddress != address(0),"Address cant be zero");
        s_payoutAddress = _payoutAddress;
    }

    // View Functions
    function getAddress(uint256 _fundingId) external view returns(address){
        return s_fundingIdToAddress[_fundingId];
    }
}