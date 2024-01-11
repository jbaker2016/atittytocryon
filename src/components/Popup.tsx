import React from 'react'
import styled from 'styled-components';

const PopupDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 10;
    
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-item: center;
`;

const PopupInner = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 95%;
    max-height: 95%;
    object-fit: contain;
    background-color: #5542F6;
    color: #fff;
    padding: 10px;
    opacity: 1;
    border-radius: 5px;
`;

function Popup() {
  return (
    <PopupDiv>
        <PopupInner>
            Time Added to Cart
        </PopupInner>
    </PopupDiv>
  );
}

export default Popup