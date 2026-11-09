import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSocket } from "../lib/socket";

// Listens to live order events and refreshes the orders list.
// Returns true while the socket is connected.
export function useOrderEvents(onNewOrder?: () => void) {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const callbackRef = useRef(onNewOrder);

  useEffect(() => {
    callbackRef.current = onNewOrder;
  }, [onNewOrder]);

  useEffect(() => {
    const socket = createSocket();
    const refresh = () =>
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("order:new", () => {
      refresh();
      callbackRef.current?.();
    });
    socket.on("order:status", refresh);
    socket.on("order:cancelled", refresh);

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return connected;
}