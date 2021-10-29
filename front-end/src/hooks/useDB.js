import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useDB(url) {
  const [data, setData] = useState('default data');
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
      setLoading('loading...')
      setData('');
      setError('');
      if (url != null){
        axios.get(url)
        .then(res => {
            setLoading(false);
            //checking for multiple responses for more flexibility 
            //with the url we send in.
            res.data.content && setData(res.data.content);
            res.content && setData(res.content);
        })
        .catch(err => {
            setLoading(false)
            setError('An error occurred. Awkward..')
        })
    }
  }, [url])

  return { data, loading, error }
    
}