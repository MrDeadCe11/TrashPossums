// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IRandomness {

    function popArray() external;

    function setArray(uint256, uint256) external;

      function getPremintNumber() external view returns(uint256);

    function getOffset() external view returns(uint256);

    function getAvailablePossums() external view returns(uint256);

    function executePremint(uint256) external;
}