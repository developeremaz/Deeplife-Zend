--
-- Contenu de la table `role`
--

INSERT INTO `role` (`id`, `parent_id`, `roleId`) VALUES
(1, NULL, 'guest'),
(2, NULL, 'user'),
(3, 2, 'admin');

INSERT INTO `users` (`id`, `username`, `email`, `password`, `firstName`, `lastName`, `displayName`) VALUES
(1, NULL, 'admin@osedea.com', '$2y$14$nDXHuG/EbpEnN.LpQJV9suGUS7c7W3czV0n8UIdOJZCFXXfOZHrUm', 'Admin', 'Istrator', 'Admin Istrator');

--
-- Contenu de la table `user_role_linker`
--

INSERT INTO `user_role_linker` (`user_id`, `role_id`) VALUES
(1, 2),
(1, 3);
