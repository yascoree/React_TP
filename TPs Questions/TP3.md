➤ Q1 : Pourquoi <Navigate /> (composant) et pas navigate() (hook) ici ?
<Navigate /> est un composant déclaratif qui permet de rediriger conditionnellement lors du rendu. C'est le bon outil ici car ProtectedRoute doit rediriger en fonction de l'état d'authentification du composant. navigate() est un hook impératif qui s'utilise dans les event handlers ou les effects, pas pendant le rendu.

➤ Q2 : Quelle différence entre navigate(from) et navigate(from, { replace: true }) ?

- navigate(from) : ajoute une entrée à l'historique du navigateur. L'utilisateur peut revenir au login avec le bouton "Retour".
- navigate(from, { replace: true }) : remplace l'entrée courante de l'historique. L'utilisateur NE peut pas revenir au login avec "Retour", car la page de login est remplacée dans l'historique.

➤ Q3 : Après un POST, pourquoi fait-on setProjects(prev => [...prev, data]) plutôt qu'un re-fetch GET ?
Parce que le serveur retourne les données du projet créé (avec son ID généré). On peut donc mettre à jour le state localement sans faire une requête GET supplémentaire. C'est plus rapide et économe en requêtes (Optimistic Update). Si le serveur retournait un ID nul, on devrait refaire un GET.

➤ Q4 : Testez ces scénarios :
a) /dashboard sans être connecté → ProtectedRoute redirige vers /login
b) /projects/1 sans être connecté → ProtectedRoute redirige vers /login
c) /nimportequoi → Matche la route "\*" et redirige vers /dashboard
d) / (racine) → Matche la route "/" et redirige vers /dashboard
e) Connecté puis bouton Retour → Grâce à replace: true, revient à la page avant la connexion (pas au login)

➤ Q5 : Quelle différence entre <Link> et <NavLink> ? Pourquoi NavLink ici ?

- <Link> : lien simple, sans style actif
- <NavLink> : lien avec automatiquement la classe "active" quand la route correspond
  NavLink est utilisé ici pour mettre en évidence le projet sélectionné (fond vert clair + texte vert foncé).

➤ Q6 : Ce composant sert pour le POST ET le PUT. Qu'est-ce qui change entre les deux usages ?
La seule différence est les props :

- Pour le POST (créer) : initialName="" et initialColor="#3498db" (valeurs par défaut)
- Pour le PUT (éditer) : initialName={project.name} et initialColor={project.color} (valeurs du projet existant)
  L'API callback onSubmit sera appelée avec les nouvelles valeurs dans les deux cas.

➤ Q7 : Arrêtez json-server et tentez un POST. Le message s'affiche ?
Oui, grâce à la gestion d'erreurs Axios. Quand json-server est arrêté, l'erreur est capturée dans le catch, et axios.isAxiosError(err) détecte l'erreur Axios. Le message d'erreur s'affiche alors dans le composant.

➤ Q8 : Avec fetch, un 404 ne lance PAS d'erreur. Avec Axios, que se passe-t-il ?
Avec Axios, un 404 EST considéré comme une erreur et lance l'exception dans le catch. Les codes d'erreur (4xx, 5xx) sont automatiquement rejetés par Axios, contrairement à fetch qui accepte tous les status codes et ne rejette que si la requête échoue (pas de connexion, timeout, etc.). C'est un avantage d'Axios.
