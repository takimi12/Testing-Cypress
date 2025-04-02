'use client'
import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

// Definiowanie typu dla pojedynczego elementu listy
interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created: string;
  url: string;
  thumbnail: string;
  source: string;
}

// Definiowanie typu dla odpowiedzi z API Reddita
interface RedditApiResponse {
  data: {
    after: string | null;
    children: {
      data: {
        id: string;
        title: string;
        author: string;
        subreddit: string;
        score: number;
        num_comments: number;
        created_utc: number;
        url: string;
        thumbnail: string;
      }
    }[];
  }
}

export default function InfiniteScrollList() {
  const [items, setItems] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [endOfList, setEndOfList] = useState<boolean>(false);
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  
  // Subreddit, z którego będziemy pobierać posty
  const subreddit: string = 'all';
  
  // Funkcja do pobierania danych z Reddit API
  const fetchData = async (): Promise<void> => {
    if (loading || endOfList) return;
    
    setLoading(true);
    
    try {
      // Parametr after pozwala na paginację na Reddicie
      let url: string = `https://www.reddit.com/r/${subreddit}/hot.json?limit=2`; 
      if (lastPostId) {
        url += `&after=${lastPostId}`;
      }
      
      const response: Response = await fetch(url);
      const data: RedditApiResponse = await response.json();
      
      // Sprawdzanie, czy mamy jeszcze dane do pobrania
      if (!data.data.children.length || pageNum >40) {
        setEndOfList(true);
        setLoading(false);
        return;
      }
      
      // Przygotowanie danych
      const postsData: RedditPost[] = data.data.children.map(child => ({
        id: child.data.id,
        title: child.data.title,
        author: child.data.author,
        subreddit: child.data.subreddit,
        score: child.data.score,
        num_comments: child.data.num_comments,
        created: new Date(child.data.created_utc * 1000).toLocaleDateString(),
        url: child.data.url,
        thumbnail: child.data.thumbnail && child.data.thumbnail.startsWith('http') 
          ? child.data.thumbnail 
          : 'https://www.redditstatic.com/icon.png',
        source: `page${pageNum}`
      }));
      
      // Sprawdzenie czy nie ma duplikatów
      const newItems: RedditPost[] = [...items];
      
      postsData.forEach(item => {
        if (!newItems.some(existingItem => existingItem.id === item.id)) {
          newItems.push(item);
        }
      });
      
      setItems(newItems);
      
      // Zapamiętanie ostatniego ID do paginacji
      if (data.data.after) {
        setLastPostId(data.data.after);
        setPageNum(prevPage => prevPage + 1);
      } else {
        setEndOfList(true);
      }
      
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obsługa Intersection Observer do wykrywania końca listy
  useEffect(() => {
    const observer: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && !loading && !endOfList) {
          fetchData();
        }
      },
      { threshold: 0.5 }
    );
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, endOfList, lastPostId, items.length]);
  
  // Efekt dla pobierania początkowych danych
  useEffect(() => {
    fetchData();
  }, []);

  
  return (
    <div className={styles.container}>
      <h1>Lista postów z Reddita z infinite scroll</h1>
      
      <div className={styles.list}>
        {items.map(item => (
          <div 
          id={item.id}
          data-testid="item"
          key={item.id} className={styles.item}>
            <img src={item.thumbnail} alt={item.title} />
            <div className={styles.content}>
              <h3>{item.title}</h3>
              <div className={styles.meta}>
                <p>Autor: {item.author} | Subreddit: r/{item.subreddit}</p>
                <p>Punkty: {item.score} | Komentarze: {item.num_comments}</p>
                <p>Data: {item.created} | Source: {item.source}</p>
              </div>
            </div>
          </div>
        ))}
        
        {!endOfList && (
          <div
          data-testid="loader"
          ref={loaderRef} className={styles.loader}>
            {loading ? 'Ładowanie...' : 'Przewiń, aby załadować więcej'}
          </div>
        )}
        
        {endOfList && (
          <div 
          data-testid="endList"
          className={styles.endMessage}>
            Koniec listy
          </div>
        )}
      </div>
    </div>
  );
}