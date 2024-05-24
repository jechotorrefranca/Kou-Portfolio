import React from 'react'
import { Link } from 'react-router-dom'

const InfoBox = ({ text, link, btnText }) => (
    <div className='info-box'>
        <p className='font-thin sm:text-2xl text-center'>{text}</p>

        <Link to={link} className='neo-brutalism-white neo-btn'>
            {btnText}
        </Link>
    </div>
)

const renderContent = {
    1: (
        <InfoBox
            text="These comprise the compilations of my completed projects."
            link='/projects'
            btnText='See Projects'/>
    ), 

    2: (
        <InfoBox
            text={
                <>
                Interested in contacting me? .
                <br />
                Please click the button below.
                </>
                }
            link='/contact'
            btnText='Contact'/>
    ), 

    3: (
        <InfoBox
            text={                
            <>
                Hello! I am Jecho P. Torrefranca, a Computer Science student.
                <br />
                To learn more about me, please click the button below.
            </>
            }
            link='/about'
            btnText='Learn More'/>
    ), 
}



const HomeInfo = ({ currentStage }) => {
  return renderContent[currentStage] || null;
}

export default HomeInfo