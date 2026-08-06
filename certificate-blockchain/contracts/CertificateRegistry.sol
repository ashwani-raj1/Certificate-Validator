// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract CertificateRegistry {

    address public owner;

    mapping(string => string) public certificates;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can add certificates");
        _;
    }

    function addCertificate(
        string memory certificateId,
        string memory hash
    ) public onlyOwner {

        require(
            bytes(certificates[certificateId]).length == 0,
            "Certificate already exists"
        );

        certificates[certificateId] = hash;
    }

    function getCertificateHash(
        string memory certificateId
    )
        public
        view
        returns(string memory)
    {
        return certificates[certificateId];
    }
}