import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const InfoBox = ({ text, link, btnText }) => (
    <div className='info-box'>
        <p className='font-semi sm:text-2xl text-center font-sans'>{text}</p>

        <Link to={link} className='neo-brutalism-white neo-btn'>
            <p className='font-sans font-bold text-neutral-900'>{btnText}</p>
            
            <FontAwesomeIcon icon={faArrowRight} color='#171717'/>
        </Link>
    </div>
)

const renderContent = {
    1: (
        <InfoBox
            text="These comprise the compilations of my completed projects."
            link='/projects'
            btnText='View Projects'/>
    ), 

    2: (
        <InfoBox
            text={
                <>
                Interested in contacting me?
                <br />
                Click the button below!
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
                To learn more about me, click the button below!
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