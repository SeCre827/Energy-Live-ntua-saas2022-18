import React from 'react';
import { FaFire } from 'react-icons/fa';
import { BsXDiamondFill } from 'react-icons/bs';
import { GiCrystalize } from 'react-icons/gi';
import { IconContext } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import Button from '../UI/Button/Button';
import './Pricing.css';

function Pricing() {
  return (
    <IconContext.Provider value={{ color: '#fff', size: 64 }}>
      <div className='pricing__section'>
        <div className='pricing__wrapper'>
          <h1 className='pricing__heading'>You must be authenticated in order to extend your plan!</h1>
          <div className='pricing__container'>
            <Link to='/' className='pricing__container-card'>
              <div className='pricing__container-cardInfo'>
                <div className='icon'>
                  <FaFire />
                </div>
                <h3>Basic</h3>
                <h4>$9.99</h4>
                <p>10 days</p>
                <ul className='pricing__container-features'>
                  <li>Access to all data</li>
                </ul>
                <Link to='/' >
                  <Button
                    type='submit'
                  >
                    Extend
                  </Button>
                </Link>
              </div>
            </Link>
            <Link to='/' className='pricing__container-card'>
              <div className='pricing__container-cardInfo'>
                <div className='icon'>
                  <BsXDiamondFill />
                </div>
                <h3>Comfort</h3>
                <h4>$19.99</h4>
                <p>20 days</p>
                <ul className='pricing__container-features'>
                  <li>Access to all data</li>
                </ul>
                <Link to='/' >
                  <Button
                    type='submit'
                  >
                    Extend
                  </Button>
                </Link>
              </div>
            </Link>
            <Link to='/' className='pricing__container-card'>
              <div className='pricing__container-cardInfo'>
                <div className='icon'>
                  <GiCrystalize />
                </div>
                <h3>Premium</h3>
                <h4>$29.99</h4>
                <p>30 days</p>
                <ul className='pricing__container-features'>
                  <li>Access to all data</li>
                </ul>
                <Link to='/' >
                  <Button
                    type='submit'
                  >
                    Extend
                  </Button>
                </Link>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className='pricing-back'>
        <Link to='/' >
          <Button
            type='submit'
          >
            Back
          </Button>
        </Link>
      </div>
    </IconContext.Provider>
  );
}
export default Pricing;
