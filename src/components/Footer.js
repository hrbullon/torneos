import { Component } from 'react'

class Footer extends Component {
    state = {  }
    render() { 
        return ( 
            <footer class="row tm-mt-small">
                <div class="col-12 font-weight-light">
                    <center>  <p class="d-inline-block tm-bg-black text-white py-2 px-4">
                        Copyright &copy; 2021. Todos los derechos reservados
                    </p></center>
                </div>
            </footer>
        );
    }
}
 
export default Footer;