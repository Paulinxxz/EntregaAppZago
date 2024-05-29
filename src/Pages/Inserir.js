import { ScrollView, TextInput, StyleSheet, Text, View, TouchableOpacity, Alert, Animated } from 'react-native';
import React, { useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function Inserir() {
    const [clientId, setClientId] = useState(0);
    const [clientName, setNome] = useState('');
    const [clientEmail, setEmail] = useState('');
    const [clientGenere, setGenero] = useState('');
    const [erro, setErro] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    const fade = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        React.useCallback(() => {
            fade.setValue(0);
            Animated.timing(fade, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }, [])
    );

    async function Cadastro() {
        if (!clientName || !clientEmail || !clientGenere) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        await fetch('http://10.139.75.44/api/Client/InsertClient', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(
                {
                 clientId: clientId,
                 clientName: clientName,
                 clientEmail: clientEmail,
                 clientGenere: clientGenere
                }
            )
        })
            .then((res) => (res.ok === true ? res.json() : false))
            .then((json) => { json.clientId ? setSucesso(true) : setErro(true) })
            .catch((err) => setErro(true));
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {sucesso ?
            <View>
                <Text style={styles.sucesso}>Obrigado por se cadastrar! Seu cadastro foi realizado com sucesso.</Text>
                <TouchableOpacity style={styles.cadastrar} onPress={() => {setSucesso(false), setNome(''), setEmail(''), setGenero('')}}>
                  <Text style={styles.voltar}>VOLTAR</Text>
                </TouchableOpacity>
                </View>
                :
                <>
                    <View style={styles.inputContainer}>
                        <Text style={styles.cadastro}>Cadastro</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(digitado) => setNome(digitado)}
                            value={clientName}
                            placeholder="Nome"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(digitado) => setEmail(digitado)}
                            value={clientEmail}
                            placeholder="Email"
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(digitado) => setGenero(digitado)}
                            value={clientGenere}
                            placeholder="Genero"
                            placeholderTextColor="gray"
                        />
                        <TouchableOpacity style={styles.cadastrar} onPress={Cadastro}>
                            <Text style={styles.textocadastrar}>CADASTRAR</Text>
                        </TouchableOpacity>
                        {erro && <Text style={styles.revisar}>Revise cuidadosamente os campos!</Text>}
                    </View>
                </>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
        backgroundColor: '#191919',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 7,
        color: 'white',
        paddingHorizontal: 10,
    },
    cadastro: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    sucesso: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 16,
        top: 15,
        textAlign: 'center',
    },
    revisar: {
        color: 'red',
        fontWeight: 'bold',
        top: 15,
    },
    cadastrar: {
        top: 30,
        height: 40,
        backgroundColor: '#007bff',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textocadastrar: {
        color: 'white',
        fontWeight: 'bold',
    },
    voltar: {
      color: 'white',
      fontWeight: 'bold',
    }
});