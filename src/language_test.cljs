(ns language-test
  (:require
    [language :refer [language]]
    [cljs.test :refer [deftest is]]))

(deftest parse
  (let [actual (js->clj (.tryParse language "-is:e (m:\"Dice Rolling\" bp=2) or (c:economic bp=4)"))
        expected (js->clj
                  (clj->js
                   [{:negate true
                     :type "META"
                     :tag "EXPANSION"}
                    {:type "OR"
                     :terms [{:type "AND"
                              :terms [{:negate false
                                       :type "DECLARATIVE"
                                       :tag "MECHANIC"
                                       :value "Dice Rolling"}
                                      {:negate false
                                       :type "RELATIONAL"
                                       :tag "BEST_PLAYERS"
                                       :operator "="
                                       :value "2"}]}
                             {:type "AND"
                              :terms [{:negate false
                                       :type "DECLARATIVE"
                                       :tag "CATEGORY"
                                       :value "economic"}
                                      {:negate false
                                       :type "RELATIONAL"
                                       :tag "BEST_PLAYERS"
                                       :operator "="
                                       :value "4"}]}]}]))]
    (is (= actual expected))))

(deftest or-chain
  (let [actual (js->clj (.tryParse language "n:a or n:b or n:c"))
        expected [{"type" "OR"
                   "terms" [{"negate" false
                             "type" "DECLARATIVE"
                             "value" "a"
                             "tag" "NAME"}
                            {"negate" false
                             "type" "DECLARATIVE"
                             "value" "b"
                             "tag" "NAME"}
                            {"negate" false
                             "type" "DECLARATIVE"
                             "value" "c"
                             "tag" "NAME"}]}]]
  (is (= actual expected))))
