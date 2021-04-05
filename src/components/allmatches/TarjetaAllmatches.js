import React from 'react';
import { faClock, faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {setMatchResult} from '../../utility/SetMatchResult';
import { setGameMode } from '../../utility/SetGameMode';
import { LOOKPROFILE } from '../../titlestag/titlestag';
import { usePalette } from 'react-palette';
import { PlaySound } from '../../utility/PlaySound';
import { TEAM } from '../../routes/routes';
import { Link } from 'react-router-dom';
import ProgressiveImage from 'react-progressive-image';
import Moment from 'moment';
import csgoLogoDefaultBlack from '../../Images/csgoLogoDefaultBlack.png';
import toBeDefined from '../../Images/toBeDefined.png';

const TarjetaAllmatches = ({match}) => {

    const {opponents, league, begin_at, serie, number_of_games, tournament, status, official_stream_url, name, results} = match; 

    const dateUser = Moment(Date.now()).format("MM-DD-YYYY");
    const dateMatch = Moment(begin_at).format("MM-DD-YYYY");
    let proxyLogo;
    let aTeamId;
    let aTeamName = "";
    let bTeamName = "";
    let aTeamLogo = "";
    let bTeamLogo = "";
    let bTeamId = "";
    let fase = "";
    let statusStream = "Streaming off";
    let statusMatch = "Today " + Moment(begin_at).format('H:mm') + "hs";
    if (league.image_url !== null && league.image_url !== csgoLogoDefaultBlack) proxyLogo = 'https://proxy-kremowy.herokuapp.com/' + league.image_url;
    let { data, error } = usePalette(proxyLogo);
    
    if (name.includes(":")) {
        fase = name.substring(
            name.lastIndexOf(0), 
            name.lastIndexOf(":")
        );
    }else{
        fase = tournament.name;
    }

    if (error) {
        data = {
            darkMuted: "#1c313a",
            darkVibrant: "#455a64",
            lightMuted: "#455a64",
            lightVibrant: "#718792",
            muted: "#1c313a",
            vibrant: "#718792",
        }
    }

    if (opponents.length !== 0) {
        if (opponents.length === 1) {
            aTeamName = opponents[0].opponent.name;
            if(opponents[0].opponent.image_url === null){
                aTeamLogo = csgoLogoDefaultBlack;
            }else{
                aTeamLogo = opponents[0].opponent.image_url;
                aTeamId = opponents[0].opponent.id;
            };
            bTeamName = "To be defined";
            bTeamLogo = toBeDefined;
        }else{
            aTeamName = opponents[0].opponent.name;
            aTeamId = opponents[0].opponent.id;

            bTeamName = opponents[1].opponent.name;
            bTeamId = opponents[1].opponent.id;
            if(opponents[0].opponent.image_url === null){
                aTeamLogo = csgoLogoDefaultBlack;
            }else{
                aTeamLogo = opponents[0].opponent.image_url;
            };
            if(opponents[1].opponent.image_url === null){
                bTeamLogo = csgoLogoDefaultBlack;
            }else{
                bTeamLogo = opponents[1].opponent.image_url;
            };
        }
    }else{
        aTeamName = "To be defined";
        aTeamLogo = toBeDefined;
        bTeamName = "To be defined";
        bTeamLogo = toBeDefined;
    }

    const {modalidad} = setGameMode(number_of_games);

    if (status === "running"){
        official_stream_url === null? statusStream = "PLAYING (no stream)" : statusStream = "LIVE";
        statusMatch = "¡Playing Now!";
        const {A_point, B_point} = setMatchResult(results, bTeamId);                            //backgroundColor: `${data.lightVibrant}`
        return (
            <div className="card posicion-tarjeta tamano-tarjeta-previo font-gilroy animate__animated animate__fadeInDown" style={{border: `5px solid ${data.lightVibrant}`}}>
                <div className="col s12 m7 posicion-tarjeta">
                    <div className="card-image">
                        <div className="card-image container-info cursor-default padding-top-8">
                            <div className="live-league-container">
                                <a className="text-center head-font highlight-text" style={{color: `${data.darkVibrant}`}} rel="noopener noreferrer" target="_blank" href={league.slug}> {league.name+" "+serie.full_name} </a>     
                            </div>
                            
                            <div className="live-container-puntos-logos-upcoming">

                                <Link to={TEAM.replace(':teamid', aTeamId)}>
                                    <div className="team-canvas"> 
                                    <ProgressiveImage src={aTeamLogo} placeholder={csgoLogoDefaultBlack}>
                                        {src => <img title={LOOKPROFILE + aTeamName} alt="a team" className="size-team-logo animate__animated animate__fadeIn animate__fast" src={src} />}
                                    </ProgressiveImage>                          
                                    </div> 
                                </Link>

                                <div title="Partidos ganados en la serie">
                                    <div className="points" title="Partidos ganados en la serie">
                                        <p className="match-winner point-A">{A_point}</p>
                                        <p>-</p>
                                        <p className="match-winner point-B">{B_point}</p>                           
                                    </div>  
                                </div>

                                <Link to={TEAM.replace(':teamid', bTeamId)}>
                                    <div className="team-canvas">
                                        <ProgressiveImage src={bTeamLogo} placeholder={csgoLogoDefaultBlack}>
                                        {src => <img title={LOOKPROFILE + bTeamName} alt="b team" className="size-team-logo animate__animated animate__fadeIn animate__fast" src={src} />}
                                        </ProgressiveImage>          
                                    </div> 
                                </Link>
                            </div>

                            <div className="container-label">
                                <p className="label-teams">{aTeamName}</p> 
                                <p className="modalidad-past-match" >{modalidad}</p>
                                <p className="label-teams">{bTeamName}</p>
                            </div> 


                            <div className="match-data">
                                <span className="font-size">
                                    <span style={{color: data.darkVibrant}}><FontAwesomeIcon className="turn-left-90" icon={faCodeBranch}/></span> 
                                    <span className="data">{fase}</span> 
                                </span>

                                <span className="font-size">
                                    <span style={{color: data.darkVibrant}}><FontAwesomeIcon icon={faClock}/>  </span>
                                    <span className="data">{Moment(begin_at).format('H:mm')}  hs</span> 
                                </span>                  
                            </div>

                            <div className="card-action live-streaming-box-bottom-padding live-streaming-box-container" onClick={()=>{official_stream_url !== null&& PlaySound()}}>
                                <a className="stream-font-color-LIVE" rel="noopener noreferrer" target="_blank" href={official_stream_url}> {statusStream} <span className="dot-indicator"></span></a>
                            </div>
                        </div>              
                    </div>
                </div>
            </div>   
            ); 
    }else{
        return(
            <div className="card posicion-tarjeta tamano-tarjeta-previo font-gilroy animate__animated animate__fadeInDown" style={{border: `5px solid ${data.lightVibrant}`}}> 
                <div className="card-image">
                    <p className="text-align-center cursor-default font-size mb-0">
                        <span className="label-data-style margin-entre-label-contenido" style={{color: data.vibrant}}>{league.name+" "+serie.full_name}</span> 
                    </p> 
    
                    <div className="card-image container-info cursor-default">
                        {dateUser === dateMatch?
                            <div className="hoy-esquina-container">
                                <p className="hoy-esquina">{fase}</p>
                                <p className="hoy-esquina">{statusMatch}</p> 
                            </div>
                        :
                            <div className="hoy-esquina-container">
                                <p className="labels-esquinas" >{fase}</p>
                                <p className="labels-esquinas">{Moment(begin_at).format('Do')} {Moment(begin_at).format('MMMM - H:mm')} hs</p> 
                            </div>
                        }
                        
    
                        <div className="container-puntosYlogos">

                            <Link to={aTeamId !== undefined&& TEAM.replace(':teamid', aTeamId)}>
                                <div className="team-canvas">  
                                    <ProgressiveImage src={aTeamLogo} placeholder={csgoLogoDefaultBlack}>
                                        {src => <img title={aTeamId !== undefined&& LOOKPROFILE + aTeamName} alt="a team" className="size-team-logo animate__animated animate__fadeIn animate__fast"  src={src} />}
                                    </ProgressiveImage>                              
                                </div>
                            </Link>
    
                            <div className="versus-label">
                                <p>VS</p>           
                            </div>         

                            <Link to={bTeamId !== undefined&& TEAM.replace(':teamid', bTeamId)}>
                                <div className="team-canvas">
                                    <ProgressiveImage src={bTeamLogo} placeholder={csgoLogoDefaultBlack}>
                                        {src => <img title={bTeamId !== undefined&& LOOKPROFILE + bTeamName} alt="b team" className="size-team-logo animate__animated animate__fadeIn animate__fast" src={src} />}
                                    </ProgressiveImage>    
                                </div> 
                            </Link>
                                
                        </div>
    
                        <div className="container-label">
                            <p className="label-teams">{aTeamName}</p> 
                            <p className="modalidad-past-match" >{modalidad}</p>
                            <p className="label-teams">{bTeamName}</p>
                        </div> 
                    </div>            
                
                </div>
                
            </div>
        );    
    }
}
 
export default TarjetaAllmatches;