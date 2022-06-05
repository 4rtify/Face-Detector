import React from 'react';

const Rank = ({ userName, userEntries}) => {
    return (
        <>
            <div className='white f3'>
                {`${userName}, current rank is....`}
            </div>
            <div className='white f1'>
                {userEntries}
            </div>
        </>
    )
}

export default Rank; 