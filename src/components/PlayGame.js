import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";

import { isMyTurn } from "../redux/actions/playerActions";

import GameBoard from './GameBoard';

function PlayGame(props) {
    const [playerTurnNotification, setPlayerTurnNotification] = useState("Wait for Your Turn");
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        clearInterval(intervalId);
        setIntervalId(null);

        if ("DETERMINED" === props.gameStatus) {
            setPlayerTurnNotification(props.winner === props.playerSymbol ? "WINNER" : "LOSER");
        } else if (props.myTurn) {
            setPlayerTurnNotification("Play Your Turn")
        } else if (props.playerId && props.gameId) {
            setPlayerTurnNotification("Wait for Your Turn");
            setIntervalId(setInterval(props.isMyTurn, 1500, { playerId: props.playerId, gameRoomId: props.gameRoomId, gameId: props.gameId }));
        }
    }, [props.myTurn, props.gameStatus]);

    return (
        <Container>
            <Row>
                <Col>{playerTurnNotification}</Col>
            </Row>
            <Row>
                <Col><GameBoard /></Col>
            </Row>
        </Container>
    );
}

PlayGame.propTypes = {
    playerId: PropTypes.string.isRequired,
    gameRoomId: PropTypes.string.isRequired,
    gameId: PropTypes.string.isRequired,
    playerSymbol: PropTypes.string.isRequired,
    myTurn: PropTypes.bool.isRequired,
    isMyTurn: PropTypes.func,
    gameStatus: PropTypes.string,
    winner: PropTypes.string,
    errorMessage: PropTypes.string
};

const mapStateToProps = state => ({
    playerId: state.player.playerId,
    gameRoomId: state.player.gameRoomId,
    gameId: state.player.gameId,
    playerSymbol: state.player.playerSymbol,
    myTurn: state.player.myTurn,
    gameStatus: state.player.gameStatus,
    winner: state.player.winner,
    errorMessage: state.error.errorMessage
});

const mapDispatchToProps = dispatch => ({
    isMyTurn: bindActionCreators(isMyTurn, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlayGame));