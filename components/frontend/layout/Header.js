import Link from 'next/link';
import React, {useContext, useState} from 'react';
import Loading from '../../widget/Loading' 
import UserContext from '../../../contexts/UserContext';
import AuthService from '../../../utils/AuthService';
import LoginModal from '../../../components/frontend/login/Modal';

const Header = (props) => {
  const {loading, banner = true} = props;
  const { user, fetchUser } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);
  const [toggle, setToggle] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    window.location = "/";
  }
  

  return (
    <>
      <header className={`header menu_fixed ${banner ? '' : 'no-banner'}`}>
        {/* {loading && <Loading loading={loading} />} */}
        <div id="logo">
          <Link href="/">
            <a>
              <img src="/icon/logo_n_w.png" height="48" alt="" className="logo_normal" />
              <img src="/icon/logo_n.png" height="48" alt="" className="logo_sticky" />
            </a>
          </Link>
        </div>
        
        <a className="btn_mobile" onClick={() => setToggle(!toggle)}>
          <div className="hamburger hamburger--spin">
            <div className="hamburger-box">
              <div className="hamburger-inner"></div>
            </div>
          </div>
        </a>
        <nav id="menu" className="main-menu">
          <ul>
            {
              !!!user ? (
                <>
                  {/* <li><span><Link href="/partner/login"><a>Pathner Login</a></Link></span></li> */}
                  <li><span><a className="a-click" onClick={() => setShowLogin(true)}>Login</a></span></li>
                </>
              ) : (
                <li><span><a href="#0">{user.firstname} {user.lastname}</a></span>
                  <ul>
                    <li><span><Link href="/user/my_booking"><a>My Booking</a></Link></span></li>
                    <li><a href="#" onClick={() => handleLogout()}>Logout</a></li>
                  </ul>
                </li>
              ) 
            }
           
          </ul>
        </nav>

        {
          !!toggle && (
            <div className="nav-mobile">
              <div className="nav-menu">
                <div className="mm-navbar"><a className="mm-title">MENU</a></div>
              </div>
              <ul className="mm-listview">
                <li><span><Link href="/"><a>Home</a></Link></span></li>
                {
                  !!!user ? (
                    <>
                      <li><span><Link href="/partner/login"><a>Pathner Login</a></Link></span></li>
                      <li><span><a className="a-click" onClick={() => setShowLogin(true)}>Login</a></span></li>
                    </>
                  ) : (
                    <>
                      <li><span><Link href="/user/my_booking"><a>My Booking</a></Link></span></li>
                      <li><a href="#" onClick={() => handleLogout()}>Logout</a></li>
                    </>
                  ) 
                }
              </ul>
              <div className={`hamburger hamburger--spin is-active`} onClick={() => setToggle(!toggle)}>
                <div className="hamburger-box">
                  <div className="hamburger-inner"></div>
                </div>
              </div>
            </div>
          )
        }
        
        <LoginModal show={showLogin}
          size="md" onHide={() => setShowLogin(false)}/>
        
      </header>
    </>
  )
}
export default Header