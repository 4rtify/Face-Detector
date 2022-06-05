import React, { Component } from 'react';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm'
import Rank from '../components/Rank/Rank';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import SignIn from '../components/SignIn/SignIn';
import './App.css';
import Register from '../components/Register/Register';

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false,
            user: {
                id: '',
                name: '',
                email: '',
                entries: 0,
                joined: ''

            }
        }
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        })
    }

    componentDidMount() {
        fetch('https://guarded-fjord-53732.herokuapp.com/')
            .then(response => response.json())
            .then(console.log)
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height),
        }
    }

    displayFaceBox = (box) => {
        this.setState({ box: box });
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onButtonSubmit = async () => {
        this.setState({ imageUrl: this.state.input })

        try {
            const data_model = await fetch('https://guarded-fjord-53732.herokuapp.com/imageurl', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: this.state.input
                })
            });

            const model = await data_model.json()

            this.displayFaceBox(this.calculateFaceLocation(model));

            const data_count = await fetch('https://guarded-fjord-53732.herokuapp.com/image', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: this.state.user.id
                })
            });

            const count = await data_count.json()
            this.setState(Object.assign(this.state.user, { entries: count }));
        } catch (error) {
            console.log(error);
        }

        // app.models.predict(
        //     Clarifai.FACE_DETECT_MODEL,
        //     this.state.input)
        //     .then(response => {
        //         if(response){
        //             fetch('http://localhost:3000/image', {
        //                 method: 'put',
        //                 headers: {'Content-Type': 'application/json'},
        //                 body: JSON.stringify({
        //                     id: this.state.user.id
        //                 })
        //             })
        //                 .then(response => response.json())
        //                 .then(count => {
        //                     this.setState(Object.assign(this.state.user, { entries: count}))
        //                 })
        //         }
        //         this.displayFaceBox(this.calculateFaceLocation(response))
        //     })
        //     .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState({ isSignedIn: false })
            this.setState({ imageUrl: ''})
        } else if (route === 'main') {
            this.setState({ isSignedIn: true })
        }
        this.setState({ route: route })
    }

    render() {
        return (
            <div>
                <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
                <Logo />
                {this.state.route === 'main'
                    ? <>
                        <Rank userName={this.state.user.name} userEntries={this.state.user.entries} />
                        <ImageLinkForm

                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}

                        />
                        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
                    </>
                    : (
                        this.state.route === 'signin'
                            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                    )
                }
            </div>
        )
    }
}

export default App;