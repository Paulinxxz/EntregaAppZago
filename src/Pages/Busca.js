import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function Busca() {
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(false);
    const [edicao, setEdicao] = useState(false);
    const [clientId, setIdcliente] = useState(0);
    const [clientName, setClienteNome] = useState();
    const [clientEmail, setEmail] = useState();
    const [clientGenere, setGenero] = useState();
    const [deleteResposta, setResposta] = useState(false);

    async function getClientes() {
        await fetch('http://10.139.75.44/api/Client/GetAllPClients', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => (res.ok == true) ? res.json() : false)
            .then(json => setClientes(json))
            .catch(err => setError(true))
    }

    async function getCliente(id) {
        await fetch('http://10.139.75.44/api/Client/GetClientId/' + id, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then(json => {
                setIdcliente(json.clientId);
                setClienteNome(json.clientName);
                setEmail(json.clientEmail);
                setGenero(json.clientGenere);
            });
    }

    async function editCliente() {
        if(!clientName || !clientEmail ||  !clientGenere ){
            Alert.alert('Erro', 'Preencha todos os campos!')
        }else{
        await fetch('http://10.139.75.44/api/Client/UpdateClient/' + clientId, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json; charset-UTF-8',
            },
            body: JSON.stringify({
                clientId: clientId,
                clientName: clientName,
                clientEmail: clientEmail,
                clientGenere: clientGenere
            })
        })
            .then((response) => response.json())
            .then(json => console.log(json))
            .catch(err => console.log(err));
        getClientes();
        setEdicao(false);
    }
    }

    function showAlert(id, clienteName) {
        Alert.alert(
            '',
            'Deseja realmente excluir esse cliente?',
            [
                { text: "Sim", onPress: () => deleteCliente(id, clienteName) },
                { text: "Não", onPress: () => ('') }
            ],
            { cancelable: false }
        );
    }

    async function deleteCliente(id, clienteName) {
        await fetch('http://10.139.75.44/api/Client/DeleteClient/' + id, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(res => res.json())
            .then(json => setResposta(json))
            .catch(err => setError(true));

        if (deleteResposta == true) {
            Alert.alert(
                '',
                clienteName + ' excluído com sucesso!',
                [
                    { text: '', onPress: () => ('') },
                    { text: 'Ok', onPress: () => ('') },
                ],
                { cancelable: false }
            );
            getClientes();
        }
        else {
            Alert.alert(
                '',
                clienteName + 'não foi excluído',
                [
                    { text: '', onPress: () => ('') },
                    { text: 'Ok', onPress: () => ('') },
                ],
                { cancelable: false }
            );
            getClientes();

        }
    };


    useEffect(() => {
        getClientes();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getClientes();
        }, [])
    );

    return (
        <View style={styles.container}>
            {edicao == false ?

                <FlatList
                    style={styles.flat}
                    data={clientes}
                    keyExtractor={(item) => item.clientId}
                    renderItem={({ item }) => (
                        <View style={styles.clientContainer}>
                        <Text style={styles.text}>
                            {item.clientName}
                            <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.btnEdit} onPress={() => { setEdicao(true); getCliente(item.clientId) }}>
                                <Text style={styles.btnLoginText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnDelete} onPress={() => showAlert(item.clientId, item.clientName)}>
                                <Text style={styles.btnLoginText}>Excluir</Text>
                            </TouchableOpacity>
                            </View>
                        </Text>
                        </View>
                    )}
                />
                :
                <View style={styles.inputEditar}>
                        <Text style={styles.editar}>Editar</Text>
                    <TextInput
                        inputMode="text"
                        style={styles.input}
                        value={clientName}
                        onChangeText={(digitado) => setClienteNome(digitado)}
                        placeholder="Nome"
                        placeholderTextColor='gray'
                    />
                    <TextInput
                        inputMode="email"
                        style={styles.input}
                        value={clientEmail}
                        onChangeText={(digitado) => setEmail(digitado)}
                        placeholder="Email"
                        placeholderTextColor='gray'
                    />
                    <TextInput
                        inputMode="text"
                        style={styles.input}
                        value={clientGenere}
                        onChangeText={(digitado) => setGenero(digitado)}
                        placeholder="Gênero"
                        placeholderTextColor='gray'
                    />
                    <TouchableOpacity style={styles.btnCreate} onPress={() => editCliente()}>
                        <Text style={styles.btnLoginText}>SALVAR</Text>
                    </TouchableOpacity>
                </View>
            }
            {error && <Text>Erro ao Buscar</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
        backgroundColor: '#191919',
    },
    flat: {
        marginTop: 40
    },
    text: {
        padding: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        borderBottomColor: '#ecf0f1',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    btnEdit: {
        backgroundColor: '#27ae60',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 10,  // Espaçamento entre botões
    },
    btnDelete: {
        backgroundColor: '#e74c3c',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    btnLoginText: {
        color: '#ecf0f1',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputEditar: {
        width: '100%',
        marginBottom: 20,
    },
    editar: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
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
    btnCreate: {
        top: 30,
        height: 40,
        backgroundColor: '#007bff',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flat: {
        width: "100%",
    },
    buttonContainer: {
        flexDirection: "row",
    },
    clientContainer: {
        marginVertical: 10,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#333'
    },
});
