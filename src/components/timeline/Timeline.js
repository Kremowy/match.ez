import React from 'react';
import Moment from 'moment';
import shortid from 'shortid';
import SimpleLoadScreen from '../loader/SimpleLoadScreen';
import csgoLogoDefaultBlack from '../../ImagenesVarias/csgoLogoDefaultBlack.png';
import toBeDefined from '../../ImagenesVarias/toBeDefined.png';
import { Link } from 'react-router-dom';
import {momentSpanishSetup} from '../../utility/MomentSpanishSetup';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import { getStyles } from '../home/getStyles/firebaseStyles';
import 'react-vertical-timeline-component/style.min.css';
import data from './fakeData';
import './timeline.css'
const Timeline = () => {
    momentSpanishSetup();
    const styles = getStyles();
    if (styles !== undefined) {
        return ( 
            <div className="timeline-background time-line-container font-gilroy" style={{backgroundColor: styles.background_color}}>
                <VerticalTimeline>
                    {   
                        data.map((tournament) => {
                            const {begin_at, league, serie, name, teams} = tournament;
                            return(
                                <VerticalTimelineElement
                                    key={shortid.generate()}
                                    className="vertical-timeline-element--education"
                                    date={Moment(begin_at).format("DD - MMMM - hh:mm")}
                                    iconStyle={{border: `4px solid ${styles.header_color}`}}
                                    icon={<Link to={`/${league.name}`} title={`Click para Ver los Próximos partidos de la ${league.name}`}><img className="tournament-logo-timeline" src={league.image_url}/></Link>}
                                    >
                                    <h3 className="vertical-timeline-element-title">{league.name}</h3>
                                    <h5 className="vertical-timeline-element-subtitle">{serie.full_name}</h5>
                                    <div className="column-align mb-5px">
                                        <span className="vertical-timeline-element-subtitle name-of-tournament font-size-20px">{name}</span>
                                        <span className="font-size-20px">Tier: <span className="font-gilroy-bold">{serie.tier}</span></span>
                                    </div>
                                    
                                    <div className="teams-in-tournament">
                                        {teams.length > 1?
                                            teams.map((team) => (
                                                <Link to={`/${team.slug}`} title={`Click para Ver el Perfil de ${team.name}`} key={shortid.generate()}>
                                                    <div className="icon-container">
                                                        <div className="team-icon">
                                                            <img className="team-logo-timeline" src={team.image_url === null?  csgoLogoDefaultBlack : team.image_url}></img>
                                                        </div>
                                                    </div>
                                                    
                                                </Link>
                                            ))
                                            :
                                            
                                            <div className="no-team-container">
                                                <div className="no-team"><img className="team-logo-timeline" src={toBeDefined}/></div>
                                                <div className="no-team"><img className="team-logo-timeline" src={toBeDefined}/></div>
                                                <div className="no-team"><img className="team-logo-timeline" src={toBeDefined}/></div>
                                            </div>
                                            
                                            
                                        }
                                    </div>
                                </VerticalTimelineElement>
                            );                                  
                        })
                    }
                    
                </VerticalTimeline>
            </div> 
        );
    }else{
        return(
            <div className="timeline-background time-line-container" style={{backgroundColor: 'black'}}>
                <SimpleLoadScreen/>
            </div>
        );
    };
   
}
 
export default Timeline;