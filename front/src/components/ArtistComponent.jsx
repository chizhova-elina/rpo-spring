import React, { Component, useEffect, useState } from 'react';
import BackendService from '../services/BackendService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faRefresh, faSave } from '@fortawesome/free-solid-svg-icons';
import { alertActions } from "../utils/Rdx";
import { connect } from "react-redux";
import { Form, NavbarBrand } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const ArtistComponent = props => {
    const params = useParams();
    const [id, setId] = useState(params.id);
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [century, setCentury] = useState("");
    const [hidden, setHidden] = useState(false);
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    
    const getCountries = () => {
        const fetchData = async () => {
            try {
              const jsonData = await BackendService.retrieveAllCntrs(); 
              setCountries(jsonData.data);
            } catch (error) {
              console.error('Ошибка при получении данных', error);
            }
          };
        
        fetchData();
    }
    useEffect(() => {
        getCountries();
        if (parseInt(id) !== -1) {
            BackendService.retrieveArtist(id)
                .then((resp) => {
                    setName(resp.data.name)
                    setCountry(resp.data.country.name)
                    setCentury(resp.data.century)
                })
                .catch(() => setHidden(true))
        }
    }, []); 



    const  onSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let err = null;
        let cntr = countries.find(c => c.name == country);
        if (!name) err = "Укажите имя художника";
        else if(!cntr) err = "Такой страны нет";
        else{ 
            let artist = { id, name, country: cntr.id, century };
            if (parseInt(artist.id) === -1) {
                BackendService.createArtist(artist)
                .then(() => navigate(`/artists`))
                .catch(() => {props.dispatch(alertActions.error("Такой художник уже есть в базе"))
                })
            } else {
                let artist1 = { id, name, country: {"name": country}, century };
                BackendService.updateArtist(artist1)
                    .then(() => navigate(`/artists`))
                    .catch(() => {props.dispatch(alertActions.error("Такой художник уже есть в базе"))
                    })
            }
        }
        if (err) props.dispatch(alertActions.error(err));
    }

    if (hidden)
        return null;
    return (
        <div className="m-4">
            <div className=" row my-2 mr-0">
                <h3>Художник</h3>
                <div className="btn-toolbar">
                    <div className="btn-group ms-auto">
                        <button className="btn btn-outline-secondary ml-auto"
                            onClick={() => navigate(`/artists`)}
                        ><FontAwesomeIcon icon={faChevronLeft} />{' '}Назад</button>
                    </div>
                </div> 
            </div>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите имя художника"
                        onChange={(e) => { setName(e.target.value) }}
                        value={name}
                        name="name"
                        autoComplete="off"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Страна</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите страну художника"
                        onChange={(e) => { setCountry(e.target.value.trim()) }}
                        value={country}
                        name="country"
                        autoComplete="off"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Век</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите возраст художника"
                        onChange={(e) => { setCentury(e.target.value) }}
                        value={century}
                        name="century"
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

export default connect()(ArtistComponent);