import React, { useState, Fragment } from 'react';
import Footer from '../footer/Footer';
import TeamsHome from './TeamsHome';
import ListadoDeTorneos from './ListadoDeTorneos';
import Search from './searchTeam/Search';
import csgoLogo from '../../LogoTeams/csgoLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import './menu.css';
import './tournament.css';

const HomeScreen = () => {

    const [navbar, setNavBar] = useState(true);
    const [teambuttonstyle, setTeamButtonStyle] = useState({backgroundColor: '#ffffff4d'});
    const [tournamentbuttonstyle, setTournamentButtonStyle] = useState({backgroundColor: '#ffffff1a'});

    const backStyle = {
        backgroundColor: '#7b0480'
    };

    const setTournament = () => {
        setNavBar(false);
        setTeamButtonStyle({
            backgroundColor: '#ffffff1a'
        })
        setTournamentButtonStyle({
            backgroundColor: '#ffffff4d'
        })
    };

    const setTeam = () => {
        setNavBar(true);
        setTeamButtonStyle({
            backgroundColor: '#ffffff4d'
        })
        setTournamentButtonStyle({
            backgroundColor: '#ffffff1a'
        })
    };

    return (
        <div className="parametros-container menu-background" style={backStyle}>
            <div className="z-depth-5 gradient-menu menu-banner"> 
                <img className="max-size-logo-header" alt="Logo Team" style={{filter: `drop-shadow(2px 2px 10px #ffffffb7)`}}  src={csgoLogo}/>   
            </div>
            <div className="nav-bar-container">
                <a onClick={ ()=>{ setTeam(); } } className="waves-effect waves-light btn nav-bar-button" style={teambuttonstyle} href="/#"><i className="material-icons prefix mr">people_outline</i>Equipos</a>
                <a onClick={ ()=>{ setTournament(); } } className="waves-effect waves-light btn nav-bar-button" style={tournamentbuttonstyle} href="/#"><FontAwesomeIcon className="color-text-white mr" icon={faTrophy}/>Torneos</a>
            </div>

            {navbar?
                <Fragment>
                    <Search/>
                    <TeamsHome/>
                </Fragment>
            :
                <div className="tournaments-position">
                    <ListadoDeTorneos/>
                </div>
            }
            <Footer/>   
        </div>
    );
}
//<TarjetaInformativa/>
export default HomeScreen;