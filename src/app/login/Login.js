import React, { useState } from 'react';
import 'firebase/auth';
import { useFirebaseApp, useUser } from 'reactfire';

export default () => {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ errorLogged, setErrorLogged ] = useState('');
    const user = useUser();

    const firebase = useFirebaseApp();

    if(user.data){
        window.location = "/home";
    }

    const signIn = async () => {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( result => {
            setMessage("Registro de usuario satisfactorio");
            setTimeout(() => {
                window.location = "/home";
            }, 3000);
        })
        .catch( e => {
            console.log(e.message);
        });
        
    }

    const logIn = async () => {
        
        if(email !== "" && password !== ""){
            
            await firebase.auth().signInWithEmailAndPassword(email, password)
            .then( result => {
                setMessage("Inicio de sesión satisfactorio");
                localStorage.setItem("logged",true);
                setTimeout(() => {
                    window.location = "/home";
                }, 3000);
            })
            .catch( e => {
                setErrorLogged("El usuario o contraseña son incorrectos");
            });

        } else {
            setErrorLogged("El usuario y la contraseña son requeridos");
        }

    }
    
    return ( 
        <div class="limiter">
            <div class="container-login100">
                <div class="wrap-login100">
                    <div class="login100-form-title">
                        <span class="login100-form-title-1">
                        Ingresar
                        </span>
                    </div>
                    { message !== "" &&
                        <div class="alert alert-success text-center">
                            { message }
                        </div>
                    }
                    <div class="login100-form validate-form">
                        <div class="wrap-input100 validate-input m-b-26" data-validate="Username is required">
                            <label class="label-input100" for="exampleInputEmail1">Correo</label>
                            <input id="txtEmail" type="email" required onChange={ (ev) => setEmail(ev.target.value) } placeholder="Email" class="input100"/>
                            <span class="focus-input100"></span>
                        </div>
                        <div class="wrap-input100 validate-input m-b-18" data-validate = "Password is required">
                            <label  class="label-input100" for="exampleInputPassword1">Clave</label>
                            <input id="txtPassword" type="password" required onChange={ (ev) => setPassword(ev.target.value) } placeholder="Contraseña" class="input100"/>
                            <span class="focus-input100"></span>
                        </div>
                        <div class="flex-sb-m w-full p-b-30">
                            <div class="contact100-form-checkbox">
                                <input class="input-checkbox100" id="ckb1" type="checkbox" name="remember-me"/>
                            </div>
                        </div>
                        {  
                            errorLogged !=="" &&
                            <div class="alert alert-danger">
                                { errorLogged }
                            </div>
                        }
                        <div class="container-login100-form-btn">
                            <button id = "btnLogin" onClick={logIn} class="login100-form-btn">Acceder</button>
                            <button id = "btnSignUp" onClick={signIn} class="login100-form-btn">Registrarme</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>       
    );
}