import React, { Component, useEffect, useState } from 'react';
import BackendService from '../services/BackendService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faRefresh, faSave } from '@fortawesome/free-solid-svg-icons';
import { alertActions } from "../utils/Rdx";
import { connect } from "react-redux";
import { Form, NavbarBrand } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const PaintingComponent = props => {
    const params = useParams();
    const [id, setId] = useState(params.id);
    const [name, setName] = useState("");
    const [year, setYear] = useState();
    const [artist, setArtist] = useState("");
    const [museum, setMuseum] = useState("");
    const [hidden, setHidden] = useState(false);
    const navigate = useNavigate();
    const [artists, setArtists] = useState([]);
    const [museums, setMuseums] = useState([]);
    
    const getData = () => {
        const fetchData = async () => {
            try {
              const jsonData = await BackendService.retrieveAllMus(); 
              setMuseums(jsonData.data);
              const jsonDt = await BackendService.retrieveAllArt(); 
              setArtists(jsonDt.data);
            } catch (error) {
              console.error('Ошибка при получении данных', error);
            }
          };
        
        fetchData();
    }

    useEffect(() => {
        getData();
        if (parseInt(id) !== -1) {
            BackendService.retrievePainting(id)
                .then((resp) => {
                    setName(resp.data.name)
                    setYear(resp.data.year)
                    setArtist(resp.data.artist.name)
                    setMuseum(resp.data.museum.name)
                })
                .catch(() => setHidden(true))
        }
    }, []); 



    const  onSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let err = null;
        let art = artists.find(a => a.name == artist.trim());
        let mus = museums.find(m => m.name == museum.trim());
        if (!name) err = "Укажите название картины";
        else if(!art) err = "Такого художника нет";
        else if(!mus) err = "Такого музея нет";
        else{ 
            let painting = { id, name, artist: art.id, museum: mus.id, year };
            if (parseInt(painting.id) === -1) {
                BackendService.createPainting(painting)
                    .then(() => navigate(`/paintings`))
                    .catch(() => {props.dispatch(alertActions.error("Такая картина уже есть в базе"))
                })
            } else {
                BackendService.updatePainting(painting)
                    .then(() => navigate(`/paintings`))
                    .catch(() => {props.dispatch(alertActions.error("Такая картина уже есть в базе"))
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
                <h3>Картина</h3>
                <div className="btn-toolbar">
                    <div className="btn-group ms-auto">
                        <button className="btn btn-outline-secondary ml-auto"
                            onClick={() => navigate(`/paintings`)}
                        ><FontAwesomeIcon icon={faChevronLeft} />{' '}Назад</button>
                    </div>
                </div> 
            </div>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите название картины"
                        onChange={(e) => { setName(e.target.value) }}
                        value={name}
                        name="name"
                        autoComplete="off"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Художник</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите автора картины"
                        onChange={(e) => { setArtist(e.target.value) }}
                        value={artist}
                        name="artist"
                        autoComplete="off"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Музей</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите музей"
                        onChange={(e) => { setMuseum(e.target.value) }}
                        value={museum}
                        name="museum"
                        autoComplete="off"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Год</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите год картины"
                        onChange={(e) => { setYear(parseInt(e.target.value.trim())) }}
                        value={year}
                        name="year"
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

export default connect()(PaintingComponent);