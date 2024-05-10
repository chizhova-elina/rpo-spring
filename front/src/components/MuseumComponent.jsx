import React, { Component, useEffect, useState } from 'react';
import BackendService from '../services/BackendService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { alertActions } from "../utils/Rdx";
import { connect } from "react-redux";
import { Form, NavbarBrand } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const MuseumComponent = props => {
    const params = useParams();
    const [id, setId] = useState(params.id);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [hidden, setHidden] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (parseInt(id) !== -1) {
            BackendService.retrieveMuseum(id)
                .then((resp) => {
                    setName(resp.data.name)
                    setLocation(resp.data.location)
                })
                .catch(() => setHidden(true))
        }
    }, []); 

    const onSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let err = null;
        if (!name) err = "Укажите название музея";
        else{ 
            let museum = { id, name, location };
            if (parseInt(museum.id) === -1) {
            BackendService.createMuseum(museum)
                .then(() => navigate(`/museums`))
                .catch()
            } else {
            BackendService.updateMuseum(museum)
                .then(() => navigate(`/museums`))
                .catch()
            }
        }
        if (err) props.dispatch(alertActions.error(err));
    }

    if (hidden)
        return null;
    return (
        <div className="m-4">
            <div className=" row my-2 mr-0">
                <h3>Музей</h3>
                <div className="btn-toolbar">
                    <div className="btn-group ms-auto">
                        <button className="btn btn-outline-secondary ml-auto"
                            onClick={() => navigate(`/museums`)}
                        ><FontAwesomeIcon icon={faChevronLeft} />{' '}Назад</button>
                    </div>
                </div> 
            </div>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите название музея"
                        onChange={(e) => { setName(e.target.value) }}
                        value={name}
                        name="name"
                        autoComplete="off"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Расположение</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите расположение музея"
                        onChange={(e) => { setLocation(e.target.value) }}
                        value={location}
                        name="location"
                        autoComplete="off"
                    />
                </Form.Group>
                <br/> 
                <div>
                    <button className="btn btn-outline-secondary" type="submit">
                        <FontAwesomeIcon icon={faSave} />{' '}
                        Сохранить
                    </button>
                </div>
            </Form>
        </div>
    )
}

export default connect()(MuseumComponent);