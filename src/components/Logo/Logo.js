import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='Logo Tilt br2 shadow-2' style={{display: 'flex', height: '150px', width: '150px'}}>
                <div>
                    <img src={brain}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;