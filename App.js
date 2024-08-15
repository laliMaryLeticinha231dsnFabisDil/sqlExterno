import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ImageBackground, Platform, StatusBar } from 'react-native';
import { supabase } from './supabaseClient';

export default function App() {
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [primeiroNome, setPrimeiroNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [idade, setIdade] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [sessao, setSessao] = useState(null);
  const [ehCadastro, setEhCadastro] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
      if (session) buscarUsuarios();
    });
  }, []);

  const buscarUsuarios = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setUsuarios(data);
    }
  };

  const cadastrarUsuario = async () => {
    if (primeiroNome && sobrenome && idade) {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ primeiro_nome: primeiroNome, sobrenome: sobrenome, idade: parseInt(idade, 10) }]);

      if (error) {
        console.error(error);
      } else {
        setPrimeiroNome('');
        setSobrenome('');
        setIdade('');
        buscarUsuarios();
      }
    }
  };

  const entrarComEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) alert(error.message);
  };

  const cadastrarComEmail = async () => {
    const { error } = await supabase.auth.signUp({ email, password: senha });

    if (error) alert(error.message);
  };

  const sair = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  if (!sessao) {
    return (
      <ImageBackground source={require('./assets/fundo.jpg')} style={estilos.background}>
        
          <Text style={estilos.titulo}>Bem-vindo ao App de Cadastro de Usuários</Text>
          <TextInput
            style={estilos.entrada}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={estilos.entrada}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          {ehCadastro ? (
            <>
              <TouchableOpacity style={estilos.botao} onPress={cadastrarComEmail}>
                <Text style={estilos.textoBotao}>Cadastrar</Text>
              </TouchableOpacity>
              <Text onPress={() => setEhCadastro(false)} style={estilos.ligacao}>Já tem uma conta? Entrar</Text>
            </>
          ) : (
            <>
              <TouchableOpacity style={estilos.botao} onPress={entrarComEmail}>
                <Text style={estilos.textoBotao}>Entrar</Text>
              </TouchableOpacity>
              <Text onPress={() => setEhCadastro(true)} style={estilos.ligacao}>Não tem uma conta? Cadastre-se</Text>
            </>
          )}
        
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('./assets/fundo.jpg')} style={estilos.background}>
      <View style={estilos.container}>
        <TextInput
          style={estilos.entrada}
          placeholder="Primeiro Nome"
          value={primeiroNome}
          onChangeText={setPrimeiroNome}
        />
        <TextInput
          style={estilos.entrada}
          placeholder="Sobrenome"
          value={sobrenome}
          onChangeText={setSobrenome}
        />
        <TextInput
          style={estilos.entrada}
          placeholder="Idade"
          value={idade}
          onChangeText={setIdade}
          keyboardType="numeric"
        />
        <TouchableOpacity style={estilos.botao} onPress={cadastrarUsuario}>
          <Text style={estilos.textoBotao}>Cadastrar</Text>
        </TouchableOpacity>
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={estilos.usuario}>
              <Text style={estilos.textoUsuario}>Nome: {item.primeiro_nome} {item.sobrenome}</Text>
              <Text style={estilos.textoUsuario}>Idade: {item.idade}</Text>
            </View>
          )}
          style={estilos.listaUsuarios}
        />
        <TouchableOpacity style={estilos.botao} onPress={sair}>
          <Text style={estilos.textoBotao}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
 background: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
},
 
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  entrada: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  botao: {
    backgroundColor: '#f585c6',
    padding: 10,
    width: '80%',
    borderRadius: 9,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
  },
  ligacao: {
    fontWeight: 'bold',
    
    borderRadius: 10,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    
    textDecorationLine: 'underline',
  },
  usuario: {
    backgroundColor: '#f8e7f0f4',
    textAlign: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
   
  },
  textoUsuario: {
    fontSize: 16,
  },
  listaUsuarios: {
    width: '100%',
  },
});
