import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Background from '~/components/Background';
import defaultAvatar from '~/assets/default-user.jpg';
import api from '~/services/api';
import { Container, ProvidersList, Provider, Avatar, Name } from './styles';

export default function SelectProvider({ navigation }) {
  const [providers, setProviders] = useState([]);
  useEffect(() => {
    async function loadProviders() {
      const response = await api.get('providers');
      setProviders(response.data);
    }
    loadProviders();
  }, []);
  return (
    <Background>
      <Container>
        <ProvidersList
          data={providers}
          keyExtractor={provider => String(provider.id)}
          renderItem={({ item: provider }) => {
            return (
              <Provider
                onPress={() => {
                  navigation.navigate('SelectDateTime', { provider });
                }}
              >
                <Avatar
                  source={
                    provider.avatar
                      ? { uri: provider.avatar.url }
                      : defaultAvatar
                  }
                />
                <Name>{provider.name}</Name>
              </Provider>
            );
          }}
        />
      </Container>
    </Background>
  );
}

SelectProvider.navigationOptions = ({ navigation }) => ({
  title: 'Selecione o prestador',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Dashboard');
      }}
    >
      <Icon name="chevron-left" size={20} color="#FFF" />
    </TouchableOpacity>
  ),
});
