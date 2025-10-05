import { useEffect, useState, useCallback, useRef } from 'react'

interface WebSocketMessage {
  type: string
  data: any
  timestamp?: number // Added by client for React state change
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  
  // Ref for deduplication tracker
  const processedMessageIds = useRef(new Set<string>()) 
  
  // Ref to store the current WebSocket instance outside of state/closure
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

    const connect = () => {
      try {
        const ws = new WebSocket(url)
        wsRef.current = ws // Store current instance

        ws.onopen = () => {
          console.log('WebSocket connected')
          setIsConnected(true)
        }

        ws.onclose = () => {
          console.log('WebSocket disconnected')
          setIsConnected(false)
          
          // Auto-reconnect after 2 seconds
          reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect...')
            connect()
          }, 2000)
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          // onclose will typically fire right after onerror, triggering reconnect
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage
            
            // --- Improved Message ID for Deduplication ---
            // Use a unique ID from the data payload, if available
            const uniqueId = message.data?.id || 'NO_ID_PROVIDED'; 
            const messageId = `${message.type}_${uniqueId}`;
            
            // Check if we've already processed this message
            if (uniqueId !== 'NO_ID_PROVIDED' && processedMessageIds.current.has(messageId)) {
              console.log(`Skipping duplicate message: ${messageId}`);
              return
            }
            
            // Add timestamp to ensure React detects change even if content is the same
            message.timestamp = Date.now()
            
            // Mark as processed (only if a unique ID was present)
            if (uniqueId !== 'NO_ID_PROVIDED') {
                 processedMessageIds.current.add(messageId)
            }
            
            // --- CORRECTED Cleanup Logic ---
            if (processedMessageIds.current.size > 100) {
              const idsToKeep = Array.from(processedMessageIds.current).slice(-50);
              processedMessageIds.current.clear(); 
              idsToKeep.forEach(id => processedMessageIds.current.add(id));
            }
            
            setLastMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }
      } catch (error) {
        console.error('Failed to create WebSocket:', error)
      }
    }

    connect()

    // --- Cleanup function ---
    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      // Use wsRef for the final closure
      if (wsRef.current) { 
        wsRef.current.close(1000, 'Component unmounting')
      }
    }
  }, [url]) // Dependency array is correct

  // sendMessage function using wsRef
  const sendMessage = useCallback(
    (message: any) => {
      if (wsRef.current && isConnected && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(message))
      } else {
        console.warn('Cannot send message: WebSocket is not open or connected.')
      }
    },
    [isConnected]
  )

  return { socket: wsRef.current, isConnected, lastMessage, sendMessage }
}