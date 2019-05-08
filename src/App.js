import React, { Component } from 'react';
import axios from 'axios';
import ButtonList from './components/ButtonList';
import Screen from './components/Screen'
import './App.css';

class App extends Component{
    state={
        // Constants:
        url:'https://9w4qucosgf.execute-api.eu-central-1.amazonaws.com/default/CR-JS_team_M02a?',
        serialNumber: '4815162342',
        serviceModeInput: '000000',
        passLength: 6,
        idleTime: 1200,
        brightScreenTime: 5000,
        lockingUnlockingTime: 3000,
        errorRecoveryTime: 2000,

        statusEnum : {
            locking: 'Locking...',
            locked: 'Locked',
            unlocking: 'Unlocking...',
            ready: 'Ready',
            validating: 'Validating...',
            error: 'Error',
            service: 'Service',
            empty: ''
        },

        doorEnum : {
            locked: 'Locked',
            unlocked: 'Unlocked',
        },

        screenEnum : {
            lightScreen: '#7fffff',
            darkScreen: '#47b2b2'
        },

        // Variables:
        password:'',
        doorState: 'Unlocked',
        timer : null,
        finalPassword: '',
        mainStatus:'',
        screenLight: '#47b2b2',
        screenLightTimer:null,
        response:'',
    };

    componentDidMount(){
        document.addEventListener("keypress", this.handleKeyboardInput);
    }
    componentWillUnmount(){
        document.removeEventListener("keypress", this.handleKeyboardInput);
    }

    handleKeyboardInput= e=>{
        this.backLightChange();
        let key = (e.key==='l')? 'L': e.key;
        const path = /^([0-9]|L|\*)/;
            if(path.test(key)){
               this.onPasswordInput(key);
            }else{
                console.log('Press right key');
            }
    }
    ;


    //function that validates master code on server
    serverValidation = (code) => {
        axios.get(`${this.state.url}${code}`)
            .then(response=>this.setState({response: response.data.sn},()=> {
                if(this.state.response === this.state.serialNumber){
                    this.setUnlockingStatus();
                }else{
                    this.setErrorStatus();
                }
            }))
            .catch(err=>{
                console.log(err);
                this.setErrorStatus();
            });
    };

    //turning light of and on
    backLightChange =()=> {
        clearTimeout(this.state.screenLightTimer);
        this.setState({screenLight: this.state.screenEnum.lightScreen, screenLightTimer:setTimeout( ()=> {
            if(this.state.mainStatus !== this.state.statusEnum.service){  //no turning of light when it is on service mode
                this.setState({screenLight: this.state.screenEnum.darkScreen, mainStatus: this.state.statusEnum.empty});
            }
        }, this.state.brightScreenTime)});
    };

    //locking function - processes character by character of user input
    locking = pass => {
        if(this.state.finalPassword.length === this.state.passLength){
            //if user types L after he entered 6 digit password, door will lock
            if(pass === 'L'){
                this.setLockingStatus();
            }else{
                // if it's not 'L' key, app will throw error status
                this.setErrorStatus();
                this.setState({finalPassword:''});
            }
        }else{
            if(this.state.password !== ''){
                // resetting timer after button is typed
                clearTimeout(this.state.timer);
            }

            let helper = this.state.password + pass;

            this.setState({
                password: helper, timer: setTimeout( ()=> {
                    if(this.state.finalPassword.length !== this.state.passLength){
                        this.resetInit();
                    }
                }, this.state.idleTime)
            }, ()=>{
                // buttons * and L are not allowed in user password and password can't be "000000"
                if(this.state.password.length === this.state.passLength) {
                    // if password is finished, but last character is 'L' or '*':
                    if(pass === '*' || pass === 'L' || this.state.password === this.state.serviceModeInput){
                        this.setErrorStatus();
                    }else{
                        this.setState({finalPassword: this.state.password});
                    }

                }
                else if(this.state.password.length > this.state.passLength){
                    // If password is finished and doesn't end with 'L':
                    if(pass !== 'L'){
                        this.setErrorStatus();
                    }
                }
                else{
                    // If password is not finished yet and contains 'L' or '*':
                    if(pass === '*'|| pass === 'L'){
                        this.setErrorStatus();
                    }
                }
            });
        }

    };

    //unlocking function
    unlocking = pass=>{
        // if app is in service state
        if(this.state.mainStatus === this.state.statusEnum.service){
            clearTimeout(this.state.timer);
            let helper = this.state.password + pass;
            this.setState({
                password: helper, timer: setTimeout(() => {
                    this.setState({mainStatus: this.state.statusEnum.validating});
                    this.serverValidation(this.state.password);
                    this.resetInit();
                }, this.state.idleTime)
            });
        }
        else{
            // Resetting timer if user is still typing
            if(this.state.password !== ''){
                clearTimeout(this.state.timer);
            }
            let helper = this.state.password + pass;
            this.setState({
                password: helper, timer: setTimeout(() => {
                    this.resetInit();
                }, this.state.idleTime)
            }, () => {
                if(this.state.password.length === this.state.passLength) {
                    //unlocking if password is correct
                    if(this.state.password === this.state.finalPassword){
                        this.setUnlockingStatus();
                    }else if(this.state.password === this.state.serviceModeInput){
                        //entering service mode
                        this.setState({mainStatus: this.state.statusEnum.service, password:''});
                    }else{
                        //error if password is incorrect
                        this.setErrorStatus();
                    }
                }else if(this.state.password.length<this.state.passLength){
                    if(pass === '*'|| pass === 'L'){
                        // no L or * sign allowed in password
                        this.setErrorStatus();
                    }

                }
            });
        }

    };

    //function which is called when user clicks on button
    onPasswordInput = pass=>{
        if(this.state.mainStatus !== this.state.statusEnum.service){
            this.setState({mainStatus: this.state.statusEnum.ready});
        }
        if((this.state.mainStatus ===  this.state.statusEnum.ready || this.state.mainStatus==='') && this.state.doorState===this.state.doorEnum.unlocked){
            this.locking(pass);
        }else if((this.state.mainStatus ===  this.state.statusEnum.ready|| this.state.mainStatus ===  this.state.statusEnum.service || this.state.mainStatus === '') && this.state.doorState=== this.state.statusEnum.locked) {
            this.unlocking(pass);
        }
    };

    //resetting password and typing timer
    resetInit = ()=>{
        this.setState({password:'', timer:null});
    };

    //setting error status immediately, and after 2 sec setting ready state
    setErrorStatus = ()=>{
        this.setState({mainStatus: this.state.statusEnum.error, password:''});
        setTimeout(()=>{
            this.setState({mainStatus: this.state.statusEnum.ready});
        },this.state.errorRecoveryTime);
    };

    // setting unlocking status, after 3 sec set door to unlock and resetting password
    setUnlockingStatus = ()=> {
        this.setState({mainStatus: this.state.statusEnum.unlocking});
        setTimeout( ()=> {
            this.setState({mainStatus: this.state.statusEnum.ready, doorState:this.state.doorEnum.unlocked, password:'', finalPassword:''});
        },this.state.lockingUnlockingTime);
    };

    // setting locking status, after 3 sec set door to lock and resetting password
    setLockingStatus = ()=>{
        this.setState({mainStatus: this.state.statusEnum.locking});
        setTimeout( ()=> {
            this.setState({mainStatus: this.state.statusEnum.ready, doorState: this.state.doorEnum.locked, password:''});
        }, this.state.lockingUnlockingTime);
    };

    render(){
        return (
            <div className="safe-box">
                <Screen doorStatus={this.state.doorState} mainStatus={this.state.mainStatus} background={this.state.screenLight} password={this.state.password}/>
                <ButtonList change={this.backLightChange} onPasswordInput = {this.onPasswordInput}/>
                <p className="safe-box__sn">
                    S/N: {this.state.serialNumber}
                </p>
            </div>
        );
    }

}

export default App;
