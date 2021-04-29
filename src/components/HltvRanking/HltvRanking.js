import React, { useContext, useEffect } from "react";
import { ColorThemeContext } from "../Context/ColorThemeContext";
import { TeamRankingContext } from "../Context/TeamRankingContext";
import SimpleLoadScreen from "../Loader/SimpleLoadScreen";
import { PathContext } from "../Context/PathContext";
import LoadScreen from "../Loader/LoadScreen";
import Warning from "../Warning/Warning";
import LazyLoad from "react-lazyload";
import Team from "./Team";
import "./hltvranking.css";

const HltvRanking = () => {
  const { colors } = useContext(ColorThemeContext);
  const { ranking, badfetch } = useContext(TeamRankingContext);
  const { paths, getTeams } = useContext(PathContext);
  const pathsArray = Object.values(paths);
  useEffect(() => {
    paths.length === 0 && getTeams();
  }, []);
  return colors.background_color !== undefined ? (
    !badfetch ? (
      <div
        className="ranking-container font-gilroy"
        style={{ backgroundColor: colors.background_color }}
      >
        {ranking.length > 0 ? (
          <div className="table-container">
            {ranking.map((team) => {
              const databaseTeam = pathsArray.find(
                (element) =>
                  element.name.toLowerCase() === team.name.toLowerCase()
              );
              const { balance, name, points, position, roster } = team;
              const img = databaseTeam && databaseTeam.img;
              const id = databaseTeam && databaseTeam.id;

              let balanceColor;
              balance.length > 1
                ? balance.includes("-")
                  ? (balanceColor = "color-text-red")
                  : (balanceColor = "color-text-green")
                : (balanceColor = "color-text-black");

              return (
                <LazyLoad offset={80} height={80} overflow key={position}>
                  <Team
                    balanceColor={balanceColor}
                    id={id}
                    img={img}
                    balance={balance}
                    name={name}
                    points={points}
                    position={position}
                    roster={roster}
                  />
                </LazyLoad>
              );
            })}
          </div>
        ) : (
          <LoadScreen />
        )}
      </div>
    ) : (
      <div
        className="ranking-container font-gilroy"
        style={{ backgroundColor: colors.background_color }}
      >
        <Warning />
      </div>
    )
  ) : (
    <SimpleLoadScreen />
  );
};

export default HltvRanking;
