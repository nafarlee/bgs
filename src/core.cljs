(ns core
  (:require
    ["express" :as express]
    [views.locals :refer [all]]
    [routes :as routes]
    [middleware :refer [with-database with-header]]))

(defonce ^:export app (express))

(defn main []
  (js/Object.assign (.-locals app) all)
  (doto app
        (.set "view engine" "pug")
        (.set "views" "src/views")
        (.use (.static express "public"))
        (.get "/search" (-> routes/search
                            (with-header "Cache-Control" (str "public, max-age=" (* 60 60 24 7)))
                            with-database))
        (.post "/pubsub/pull" (-> routes/pull
                                  with-database))
        (.post "/pubsub/pull-plays" (-> routes/pull-plays
                                        with-database))
        (.get "/games/:id" (-> routes/games
                               (with-header "Cache-Control" (str "public, max-age=" (* 60 60 24 7)))
                               with-database))
        (.listen 8080 #(prn "Listening on 8080..."))))
