import React, { useEffect, useState, useContext, Suspense } from "react";
import { useParams, useHistory } from "react-router";
import { PaletteContext } from "../Context/PaletteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { HOME } from "../../routes/routes";
import { TEAM_INFO } from "../../const/ApiEndpoints";
import MobileHeader from "../MobileHeader/MobileHeader";
import TeamPreview from "../TeamPreview/TeamPreview";
import LoadScreen from "../Loader/LoadScreen";
import csgoLogoDefault from "../../Images/csgoLogoDefault.png";
import axios from "axios";
import "../../styles/base.css";

const OneTeamMapping = React.lazy(() =>
  import("../OneTeamCard/OneTeamMapping")
);
const InfoCard = React.lazy(() => import("../InfoCard/InfoCard"));
const CircularTournaments = React.lazy(() =>
  import("../CircularTournaments/CircularTournaments")
);
const HistoricMatchMapping = React.lazy(() =>
  import("../HistoricMatchCard/HistoricMatchMapping")
);
const Warning = React.lazy(() => import("../Warning/Warning"));

const TeamProfile = () => {
  const { teamid } = useParams();
  const history = useHistory();
  !teamid && history.push(HOME);

  const { palette, setPalette, setLogo } = useContext(PaletteContext);
  const [loaderprogress, guardarLoaderProgress] = useState({ width: "0%" });
  const [stadistics, setStadistics] = useState([]);
  const [prevMatch, guardarPrevMatch] = useState([]);
  const [matchesmod, guardarMatchesMod] = useState([]);
  const [matches, guardarMatches] = useState([]);
  const [playerscore, setPlayerScore] = useState([]);
  const [roster, setRoster] = useState([]);
  const [crash, guardarStateCrash] = useState(false);
  const [noMatches, guardarNoMatches] = useState(false);
  const [image_url, setImageTeam] = useState("");
  const [show, setShow] = useState();
  const [buttonstatus, setButtonStatus] = useState({
    preview: true,
    vs: false,
    history: false,
    ladder: false,
  });

  const loadMoreItems = () => {
    let arrayLimit =
      matchesmod.length === 6
        ? Math.round(prevMatch.length / 2)
        : prevMatch.length;
    guardarMatchesMod(prevMatch.slice(0, arrayLimit));
  };

  const filterByTournament = (name) => {
    const arrmatches = show === "vs" ? matches : prevMatch;
    const matchesFiltered = arrmatches.filter(
      (match) => match.league.name === name
    );
    show === "vs"
      ? guardarMatches(matchesFiltered)
      : guardarPrevMatch(matchesFiltered);
  };

  const setHistory = () => {
    window.scrollTo(0, 0);
    setButtonStatus({
      vs: false,
      history: true,
      ladder: false,
      preview: false,
    });
    setShow("history");
  };

  const setVs = () => {
    window.scrollTo(0, 0);
    setButtonStatus({
      vs: true,
      history: false,
      ladder: false,
      preview: false,
    });
    setShow("vs");
  };

  const setPreview = () => {
    window.scrollTo(0, 0);
    setButtonStatus({
      vs: false,
      history: false,
      ladder: false,
      preview: true,
    });
    setShow("preview");
  };

  useEffect(() => {
    setPreview();
    guardarLoaderProgress({ width: "0%" });
    guardarNoMatches(false);
    guardarStateCrash(false);

    const config = {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .get(TEAM_INFO.replace(":id", teamid), config)
      .then(({ data }) => {
        const {
          historicMatches,
          upcomingMatches,
          roster,
          winStrike,
          winRate,
          wl,
          imageTeam,
          colors,
        } = data;
        setRoster(roster);
        if (historicMatches && historicMatches.length !== 0) {
          guardarMatchesMod(historicMatches.slice(0, 6));
          guardarPrevMatch(historicMatches);
          setPalette(colors);
          if (imageTeam === null) {
            setImageTeam(csgoLogoDefault);
            setLogo("");
          } else {
            setLogo(setLogo);
            setImageTeam(imageTeam);
          }
        } else {
          guardarPrevMatch("no-match");
        }
        upcomingMatches.length !== 0 && guardarMatches(upcomingMatches);
        setStadistics({ winStrike, winRate, wl });
        guardarLoaderProgress({ width: "100%" });
      })
      .catch(() => {
        guardarStateCrash(true);
        guardarLoaderProgress({ width: "100%" });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamid]);

  const { width } = loaderprogress;
  if (!crash) {
    if (width === "100%") {
      return (
        <div
          className="parametros-container mosaico noselect"
          style={{ backgroundColor: palette.DarkVibrant }}
        >
          <MobileHeader
            color={palette}
            img={image_url}
            buttonstatus={buttonstatus}
            setPreview={setPreview}
            setVs={setVs}
            setHistory={setHistory}
            isProfile
            setLadder
          />

          {show === "preview" && stadistics.winStrike !== undefined && (
            <TeamPreview
              img={image_url}
              teamid={teamid}
              color={palette}
              matches={matches}
              prevMatch={prevMatch}
              setPreview={setPreview}
              setVs={setVs}
              setHistory={setHistory}
              roster={roster}
              winRate={stadistics.winRate}
              winStrike={stadistics.winStrike}
              wl={stadistics.wl}
            />
          )}
          {show === "vs" && !matches.length > 0 && (
            <Suspense fallback={<div></div>}>
              <InfoCard noMatches={noMatches} />
            </Suspense>
          )}
          {show === "vs" && matches.length > 0 && (
            <Suspense fallback={<div></div>}>
              <CircularTournaments
                filterByTournament={filterByTournament}
                matches={matches}
              />
              <OneTeamMapping matches={matches} teamid={teamid} />
            </Suspense>
          )}

          {show === "history" && prevMatch !== "no-match" && (
            <>
              <Suspense fallback={<div></div>}>
                <CircularTournaments
                  filterByTournament={filterByTournament}
                  prevMatch={prevMatch}
                />
                <HistoricMatchMapping
                  prevMatch={matchesmod}
                  teamid={teamid}
                  setPlayerScore={setPlayerScore}
                  playerscore={playerscore}
                />
                {matchesmod.length !== prevMatch.length && (
                  <div
                    onClick={() => {
                      loadMoreItems();
                    }}
                    className="load-more"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                )}
              </Suspense>
            </>
          )}
          {/* <Logo color={palette} img={image_url} /> */}
        </div>
      );
    } else {
      // RETURN APP LOADING
      return (
        <div
          className="parametros-container noselect"
          style={{ backgroundColor: "black" }}
        >
          <LoadScreen loaderprogress={loaderprogress} />
        </div>
      );
    }
  } else {
    return (
      <div
        className="parametros-container noselect"
        style={{ backgroundColor: "#040c1c" }}
      >
        <Suspense fallback={<div></div>}>
          <Warning />
        </Suspense>
      </div>
    );
  }
};

export default TeamProfile;
