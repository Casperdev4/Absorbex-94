"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PiChecks,
  PiDotsThreeOutlineFill,
  PiImage,
  PiList,
  PiMagnifyingGlass,
  PiPaperPlaneTiltBold,
  PiSpinner,
  PiXCircle,
} from "react-icons/pi";
import { chatList } from "@/data/data";
import Image from "next/image";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { initSocket, sendMessage, startTyping, stopTyping, joinConversation } from "@/lib/socket";
import { Conversation, Message, User } from "@/types";
import { conversationsApi } from "@/lib/api";

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workerId = searchParams.get("workerId");

  const [toggle, setToggle] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    typingUsers,
    fetchConversations,
    setCurrentConversation,
    initSocketListeners,
  } = useChatStore();

  // Initialiser le socket et charger les conversations
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sign-in?redirect=/chat");
      return;
    }

    if (isAuthenticated && user && !isInitialized) {
      const token = localStorage.getItem("token");
      if (token) {
        initSocket(token);
        initSocketListeners();
        fetchConversations();
        setIsInitialized(true);
      }
    }
  }, [isAuthenticated, authLoading, user, isInitialized]);

  // Créer une conversation si workerId est fourni
  useEffect(() => {
    const createConversationWithWorker = async () => {
      if (workerId && isAuthenticated && conversations.length >= 0) {
        // Vérifier si une conversation existe déjà avec ce worker
        const existingConv = conversations.find((conv) =>
          conv.participants.some(
            (p) => (p._id === workerId || p.id === workerId) && (p._id !== user?.id && p.id !== user?.id)
          )
        );

        if (existingConv) {
          setCurrentConversation(existingConv);
        } else {
          // Créer une nouvelle conversation (sera fait via l'API quand le premier message est envoyé)
          // Pour l'instant, on peut afficher une interface "nouvelle conversation"
        }
      }
    };

    if (isInitialized) {
      createConversationWithWorker();
    }
  }, [workerId, isInitialized, conversations]);

  // Rejoindre la room de la conversation courante
  useEffect(() => {
    if (currentConversation) {
      joinConversation(currentConversation._id);
    }
  }, [currentConversation]);

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentConversation) return;

    sendMessage(currentConversation._id, messageInput.trim());
    setMessageInput("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      stopTyping(currentConversation._id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    if (currentConversation) {
      startTyping(currentConversation._id);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(currentConversation._id);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = (conversation: Conversation): User | null => {
    if (!user) return null;
    return conversation.participants.find(
      (p) => p._id !== user.id && p.id !== user.id && p._id !== user._id
    ) || null;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}j`;
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const otherUser = getOtherParticipant(conv);
    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Si chargement auth
  if (authLoading) {
    return (
      <section className="sbp-30 flex items-center justify-center py-40">
        <PiSpinner className="animate-spin text-4xl text-b300" />
      </section>
    );
  }

  // Si pas connecté (fallback avec données statiques)
  if (!isAuthenticated) {
    return (
      <section className="sbp-30">
        <div className="container grid grid-cols-12 border border-primary-20 rounded-xl lg:rounded-2xl mt-24 sm:mt-28 shadow-[0px_4px_26px_0px_rgba(222,222,222,0.25)]">
          <div className="col-span-12 py-20 text-center">
            <h3 className="heading-3 text-n500">Connexion requise</h3>
            <p className="pt-4 text-n300">Connectez-vous pour accéder à vos messages</p>
            <button
              onClick={() => router.push("/sign-in?redirect=/chat")}
              className="mt-6 rounded-xl bg-b300 px-8 py-3 font-semibold text-white"
            >
              Se connecter
            </button>
          </div>
        </div>
      </section>
    );
  }

  const currentOtherUser = currentConversation ? getOtherParticipant(currentConversation) : null;
  const currentTypingUsers = currentConversation ? typingUsers[currentConversation._id] || [] : [];

  return (
    <section className="sbp-30">
      <div className="container grid grid-cols-12 border border-primary-20 rounded-xl lg:rounded-2xl mt-24 sm:mt-28 shadow-[0px_4px_26px_0px_rgba(222,222,222,0.25)]">
        {/* Liste des conversations */}
        <div
          className={`lg:col-span-3 max-lg:absolute py-8 border-r bg-white ${
            toggle
              ? "max-lg:translate-x-0 max-lg:visible max-lg:z-10"
              : "max-lg:translate-x-[-100%] max-lg:invisible"
          } duration-500`}
        >
          <div className="flex justify-between items-center px-6 pb-5">
            <div className="flex justify-start items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="rounded-xl w-12 h-12 object-cover shadow-[0px_4px_9px_0px_rgba(100,218,255,0.39)]"
                />
              ) : (
                <div className="rounded-xl w-12 h-12 bg-b300 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || "?"}
                </div>
              )}
              <h5 className="heading-5">Messages</h5>
            </div>
            <div className="flex justify-end items-center gap-2">
              <span className="text-2xl bg-slate-100 px-2 rounded-xl block cursor-pointer">
                <PiDotsThreeOutlineFill />
              </span>
              <span
                className="text-2xl block lg:hidden cursor-pointer"
                onClick={() => setToggle(false)}
              >
                <PiXCircle />
              </span>
            </div>
          </div>

          <div className="flex justify-start items-center bg-slate-100 gap-2 py-3 px-5 rounded-xl mx-6">
            <span className="block text-slate-400 text-xl">
              <PiMagnifyingGlass />
            </span>
            <input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none bg-transparent w-full"
            />
          </div>

          <div className="flex flex-col max-h-[460px] overflow-auto pt-5">
            {isLoading && conversations.length === 0 ? (
              <div className="flex justify-center py-10">
                <PiSpinner className="animate-spin text-2xl text-b300" />
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const otherUser = getOtherParticipant(conv);
                const isActive = currentConversation?._id === conv._id;
                const hasUnread = conv.unreadCount && conv.unreadCount > 0;

                return (
                  <div
                    className={`py-5 px-2 flex justify-start gap-3 items-center pl-6 cursor-pointer hover:bg-primary-20 ${
                      isActive ? "bg-b50" : ""
                    }`}
                    key={conv._id}
                    onClick={() => {
                      setCurrentConversation(conv);
                      setToggle(false);
                    }}
                  >
                    {otherUser?.avatar ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="rounded-xl w-12 h-12 object-cover"
                      />
                    ) : (
                      <div className="rounded-xl w-12 h-12 bg-n200 flex items-center justify-center text-white font-bold">
                        {otherUser?.name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-start items-center gap-2 pb-1">
                        <p className="font-medium truncate">{otherUser?.name || "Utilisateur"}</p>
                        {hasUnread && (
                          <p className="text-sm font-medium text-white px-1.5 py-1 !leading-none rounded-full bg-p1">
                            {conv.unreadCount}
                          </p>
                        )}
                      </div>
                      <div className="text-sm flex justify-start items-center">
                        <p className={`truncate ${hasUnread ? "font-medium" : "text-slate-400"}`}>
                          {conv.lastMessage?.content || "Démarrer la conversation"}
                        </p>
                        {conv.lastMessage && (
                          <p className="flex justify-start items-center pl-2 flex-shrink-0">
                            <span className="w-2 h-2 block rounded-full bg-slate-300"></span>
                            <span className="block pl-1 !leading-none text-t88">
                              {formatRelativeTime(conv.lastMessage.createdAt)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-n300">
                <p>Aucune conversation</p>
                <p className="text-sm pt-2">
                  Contactez un prestataire pour démarrer
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="col-span-12 lg:col-span-9">
          {currentConversation && currentOtherUser ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center px-4 sm:px-6 py-5 bg-slate-100 border-b">
                <div className="flex justify-start items-center gap-2">
                  <i
                    className="lg:hidden text-2xl cursor-pointer"
                    onClick={() => setToggle(true)}
                  >
                    <PiList />
                  </i>
                  {currentOtherUser.avatar ? (
                    <img
                      src={currentOtherUser.avatar}
                      alt={currentOtherUser.name}
                      className="rounded-xl w-12 h-12 object-cover shadow-[0px_4px_9px_0px_rgba(100,218,255,0.39)]"
                    />
                  ) : (
                    <div className="rounded-xl w-12 h-12 bg-b300 flex items-center justify-center text-white font-bold">
                      {currentOtherUser.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div>
                    <p className="xl-body">{currentOtherUser.name}</p>
                    <p className={`text-sm ${currentOtherUser.isOnline ? "text-[#1ED400]" : "text-slate-400"}`}>
                      {currentOtherUser.isOnline ? "En ligne" : "Hors ligne"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 flex flex-col gap-4 min-h-[400px] max-h-[500px] overflow-auto">
                {isLoading && messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <PiSpinner className="animate-spin text-2xl text-b300" />
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => {
                    const isOwnMessage =
                      (typeof msg.sender === "string" ? msg.sender : msg.sender._id || msg.sender.id) ===
                      (user?._id || user?.id);

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} items-end gap-2 w-full`}
                      >
                        {!isOwnMessage && (
                          currentOtherUser.avatar ? (
                            <img
                              src={currentOtherUser.avatar}
                              alt={currentOtherUser.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-n200 flex items-center justify-center text-white text-sm font-bold">
                              {currentOtherUser.name?.charAt(0)}
                            </div>
                          )
                        )}
                        <div
                          className={`py-3 px-5 rounded-b-xl ${
                            isOwnMessage
                              ? "rounded-tl-xl bg-b300 text-white"
                              : "rounded-tr-xl bg-slate-200"
                          } max-w-[70%]`}
                        >
                          <p className={`text-base ${isOwnMessage ? "" : "text-slate-700"}`}>
                            {msg.content}
                          </p>
                          <p
                            className={`text-sm ${
                              isOwnMessage ? "text-white/50" : "text-slate-400"
                            } flex justify-start items-center`}
                          >
                            {isOwnMessage && msg.read && (
                              <span className="pr-1">
                                <PiChecks />
                              </span>
                            )}
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                        {isOwnMessage && (
                          user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-b300 flex items-center justify-center text-white text-sm font-bold">
                              {user?.name?.charAt(0)}
                            </div>
                          )
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-center items-center h-full text-n300">
                    <p>Aucun message. Commencez la conversation !</p>
                  </div>
                )}

                {/* Indicateur de frappe */}
                {currentTypingUsers.length > 0 && (
                  <div className="flex justify-start items-center gap-2">
                    <div className="py-2 px-4 rounded-xl bg-slate-100 text-sm text-slate-500">
                      {currentOtherUser.name} est en train d'écrire...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="mx-6 mb-7 rounded-xl px-4 pb-5 max-lg:md:pt-3 lg:rounded-2xl">
                <div className="flex items-center justify-between gap-4 pt-2 max-md:flex-col lg:pt-6">
                  <div className="flex w-full items-center justify-between gap-4 rounded-xl bg-[#F6F5F8] p-4 max-md:flex-col lg:rounded-2xl">
                    <input
                      className="w-full bg-transparent outline-none"
                      placeholder="Écrivez votre message..."
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                    />
                    <div className="text-t88 flex items-center justify-between gap-1 text-2xl max-md:hidden xl:gap-3">
                      <div className="cursor-pointer">
                        <label htmlFor="chat-file-file">
                          <span className="cursor-pointer">
                            <PiImage />
                          </span>
                        </label>
                        <input className="hidden" id="chat-file-file" type="file" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4 max-md:w-full">
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="l-body rounded-xl bg-n900 px-6 py-2 text-2xl !leading-none text-white duration-500 hover:bg-r300 md:px-8 md:py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PiPaperPlaneTiltBold />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* État vide - aucune conversation sélectionnée */
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-n300">
              <i
                className="lg:hidden text-2xl cursor-pointer mb-4"
                onClick={() => setToggle(true)}
              >
                <PiList />
              </i>
              <h3 className="heading-4 text-n500">Sélectionnez une conversation</h3>
              <p className="pt-2 text-center">
                Choisissez une conversation dans la liste <br />
                ou contactez un prestataire pour commencer
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ChatPage() {
  return (
    <Suspense fallback={
      <section className="sbp-30 flex items-center justify-center py-40">
        <PiSpinner className="animate-spin text-4xl text-b300" />
      </section>
    }>
      <ChatPageContent />
    </Suspense>
  );
}

export default ChatPage;
