import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import './App.css'
import logo from './logo192.png'
import api from './services/api'

function App() {
  const [gelinhos, setGelinhos] = useState([])
  const [bool, setBool] = useState(false);

  const [sabor, setSabor] = useState();
  const [quantidade, setQuantidade] = useState(0);

  useEffect(() =>{
    async function loadGelinhos() {
      const ice = await api.get('/')
      setGelinhos(ice.data)
    }
    loadGelinhos()
  },[])

  async function estoqueDelete(id, e){
    await api.delete(`/apagar/${id}`)

    const copia = gelinhos.filter((gelinho) => gelinho._id !== id)
    setGelinhos(copia)
  }

  function estoqueSave() {
    console.log(gelinhos)
    gelinhos.map(async ice=>{
      await api.put(`/editar/${ice._id}`, ice)
    })
    setBool(false)
  }

  async function estoqueChanged(id,gel,e) {
    setBool(true)
    const index = gelinhos.findIndex(gelinhos=>gelinhos._id === id ) //encontre o indice do vetor de gelinhos onde o _id é igual ao recebido
    console.log('IDX'+index+'_ID'+id+'kkkkkkkkkkkkkkkkkkk')
    
    var copia = gelinhos
    console.log(copia[index])
    copia[index].quantidade = parseInt(e.target.value)
    setGelinhos(copia)
    console.log(gelinhos[index])
  }

  async function estoqueNew(){
    if(!sabor)
      alert('Insira um sabor')
    else
      await api.post('/novo', {"sabor":sabor,"quantidade":quantidade})
    
    setSabor('')
    setQuantidade(0)
    
    setGelinhos(await (await api.get('/')).data)
  }

  return (
    <div className="App">
      <header>
        <img src={logo} alt="Logo"></img>
      </header>
      <aside className="side-left">
            <h1>Cadastrar novo sabor?</h1>
            <Input color="primary" onChange={(e) => setSabor(e.target.value)} value={sabor || ""} autoComplete="off" id="filled-secondary" required placeholder="Sabor" type='text'/>
            <Input color="primary" onChange={(e) => setQuantidade(e.target.value)} required defaultValue="0" type='number'></Input>
            <Button className="salvar" onClick={estoqueNew} color="primary" type="submit">Cadastrar</Button>
            {bool===true?<Button className="salvarAlter" onClick={estoqueSave} variant="contained" color="primary">Salvar Alterações</Button>:<h2>...</h2>}
      </aside>
      <main>
        {gelinhos.map(gelinhos=>{
          const id=gelinhos._id
          return(
            <div key={gelinhos._id} className="gelinho-Item">
              <h3>{gelinhos.sabor}</h3>
              <h5>Quantidade</h5>
              
              <Input className="inpt" color="primary" required type="number"  defaultValue={gelinhos.quantidade} onChange={(e)=>estoqueChanged(gelinhos._id,gelinhos,e)}></Input>
              
              <p onClick={(e) => estoqueDelete(id, e)}>
                <i id="delete" className="material-icons">delete</i>
              </p>

            </div>
          )
        })}
        
      </main>
    </div>
  );
}

export default App;
