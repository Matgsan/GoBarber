import React, { useMemo } from 'react';
import { View } from 'react-native';
import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Background from '~/components/Background';
import { Container, Avatar, Name, Time, SubmitButton } from './styles';
import api from '~/services/api';
import defaultAvatar from '~/assets/default-user.jpg';

export default function Confirm({ navigation }) {
  console.tron.log(navigation);
  const provider = navigation.getParam('provider');
  const time = navigation.getParam('time');

  const dateFormatted = useMemo(
    () => formatRelative(parseISO(time), new Date(), { locale: pt }),
    [time]
  );

  async function handleAddAppointment() {
    await api.post('appointments', {
      provider_id: provider.id,
      date: time,
    });
    navigation.navigate('Dashboard');
  }

  return (
    <Background>
      <Container>
        <Avatar
          source={
            provider.avatar ? { uri: provider.avatar.url } : defaultAvatar
          }
        />
        <Name>{provider.name}</Name>
        <Time>{dateFormatted}</Time>
        <SubmitButton onPress={handleAddAppointment}>
          Confirmar Agendamento
        </SubmitButton>
      </Container>
    </Background>
  );
}
