import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MdNotifications } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import {
  Container,
  Badge,
  NotificationList,
  Scroll,
  Notification,
} from './styles';
import api from '~/services/api';

export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const hasUnread = useMemo(() => {
    return !!notifications.find(notification => notification.read === false);
  }, [notifications]);

  const handleToggleVisible = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  useEffect(() => {
    async function loadNotifications() {
      const response = await api.get('/notifications');

      const data = response.data.map(notification => ({
        ...notification,
        timeDistance: formatDistance(
          parseISO(notification.createdAt),
          new Date(),
          {
            addSuffix: true,
            locale: pt,
          }
        ),
      }));

      setNotifications(data);
    }
    loadNotifications();
  }, []);

  const markAsRead = useCallback(
    id => {
      async function markAsReadFunc() {
        console.tron.log(id);
        await api.put(`notifications/${id}`);
        setNotifications(
          notifications.map(notification =>
            notification._id === id
              ? { ...notification, read: true }
              : notification
          )
        );
      }
      markAsReadFunc();
    },
    [notifications]
  );
  return (
    <Container>
      <Badge onClick={handleToggleVisible} hasUnread={hasUnread}>
        <MdNotifications color="#7159c1" size={20} />
      </Badge>

      <NotificationList visible={visible}>
        <Scroll>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <Notification key={notification._id} unread={!notification.read}>
                <p>{notification.content}</p>
                <time>{notification.timeDistance}</time>
                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => markAsRead(notification._id)}
                  >
                    Marcar como lida
                  </button>
                )}
              </Notification>
            ))
          ) : (
            <Notification>
              <p>Você não tem nenhuma notificação</p>
            </Notification>
          )}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
