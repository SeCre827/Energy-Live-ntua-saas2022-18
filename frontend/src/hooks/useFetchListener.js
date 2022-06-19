import { useQuery } from 'react-query';
import axios from 'axios';

export const useFetchListener = (onSuccess, onError, token, dataset) => {

    const fetchListener = () => {
        return axios.get(`http://localhost:4005/${dataset}-latest`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      }

    return useQuery('front-listener-get', fetchListener, {
        refetchInterval: 100000,
        onSuccess: onSuccess("listener"),
        onError: onError("listener"),
      })
  }