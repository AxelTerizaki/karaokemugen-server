export default {
	error: {
		generic: "Erreur"
	},
	kara: {
		phrase: "{songtype} de {series}",
		notfound: "Karaoké non trouvé",
		tagtypes: {
			series: "Série | Séries",
			langs: "Langue | Langues",
			songtypes: "Type de chanson | Types de chanson",
			singers: "Chanteur | Chanteurs",
			songwriters: "Compositeur | Compositeurs",
			families: "Famille | Familles",
			origins: "Origine | Origines",
			genres: "Genre | Genres",
			platforms: "Plateforme | Plateformes",
			creators: "Créateur | Créateurs",
			authors: "Auteur du karaoké | Auteurs du karaoké",
			groups: "Groupe | Groupes",
			misc: "Divers"
		},
		download: 'Ajouter à l\'application',
		import: {
			description: "Ce formulaire permet d'envoyer un karaoké à l'équipe de Karaoke Mugen. Il ne sera pas intégré immédiatement dans la base de karaokés car il nécessite une validation préalable. Aussi, votre karaoké peut être modifié par l'équipe de Karaoke Mugen s'il ne convient pas aux normes. Reportez-vous à la documentation pour plus d'information, section \"Guide du contributeur\" puis \"Documents de référence\".",
			attention: "ATTENTION :",
			check_in_progress: "Merci de vérifier la liste des karaokés en cours de réalisation avant de proposer un karaoké. Cela évitera à tout le monde de faire deux fois le travail, et le monde sera meilleur.",
			documentation_link: "Documentation",
			in_progress_link: "Liste des karaokés en cours",
			license_reminder: "Votre karaoké sera publié avec la licence {name}",
			license_link: "Renseignez-vous sur cette licence en cliquant ici.",
			add: "Ajout",
			choose_file: "Choisissez un fichier",
			add_file_media_error: "{name} n'est pas un fichier vidéo",
			add_file_lyrics_error: "{name} n'est pas un fichier de sous-titres",
			add_file_success: "Le fichier {name} a été ajouté avec succès",
			comment_tooltip: "Si vous voulez donner des indications aux mainteneurs de la base de karaokés ou simplement dire merci, faites-le ici !",
			comment: "Un commentaire ?",
			comment_edit: "N'hésitez pas à signer votre correction pour qu'on sache qui vous êtes !",
			submit: "Envoyer ce karaoké",
			media_file: "Fichier vidéo",
			media_file_tooltip: "Formats de fichier acceptés : {formats}",
			lyrics_file: "Fichier de sous-titres",
			lyrics_file_tooltip: "Format de fichier accepté : {formats}",
			title: "Titre du morceau",
			title_required: "Le titre est obligatoire",
			title_tooltip: "Si vous ne le connaissez pas, mettez le nom de la série. Dans le cas d'une version alternative, nommez votre titre ainsi : 'Mon titre ~ Disco vers.' par exemple",
			series_tooltip: "Série TV, nom de film, de jeu vidéo, etc.",
			series_singers_required: "Les champs Séries et Chanteurs ne peuvent être vide en même temps.",
			songtypes_required: "Le type de chanson est obligatoire",
			songorder: "Numéro de chanson",
			songorder_tooltip: "Numéro de l'opening/ending/etc. Si c'est le seul opening/ending dans la série, laissez vide.",
			langs_required: "Choisissez une langue",
			year: "Année de diffusion",
			year_tooltip: "Année de la diffusion de la série ou de la vidéo",
			year_required: "L'année de diffusion est obligatoire",
			songwriters_tooltip: "Compositeurs et paroliers",
			creators_tooltip: "Entité qui a créé la série ou le clip. Peut être un studio d'animation, de cinéma, de jeu vidéo, etc.",
			authors_tooltip: "Vous devriez vous ajouter ici ;)",
			authors_required: "L'auteur du karaoké est obligatoire",
			groups_tooltip: "Groupes de téléchargement pour ce morceau. Le morceau sera ajouté dans ces paquets pour le téléchargement",
			created_at: "Date de création",
			modified_at: "Date de dernière mise à jour",
			add_success: "Karaoké envoyé avec succès.",
			add_succes_description: "Un ticket a été crée sur notre outil de suivi. Vous pouvez consulter l'avancement de l'intégration de votre karaoké : ",
			add_error: "Une erreur a eu lieu, le karaoké n'a pas pu être envoyé",
		}
	},
	layout: {
		loading: "Chargement..."
	},
	footer: {
		home: "Accueil du projet",
		software_under_license: "Logiciel sous licence ",
		base_under_licence: "Base de karaokés sous licence"
	},
	stats: {
		karaokes: "Karaoké | Karaokés",
		all_duration: "Durée de tous les karas",
		last_generation: "Dernière mise à jour",
		media_size: "Taille des médias"
	},
	duration: {
		days: "jours",
		hours: "heures",
		minutes: "minutes",
		seconds: "secondes"
	},
	menu: {
		kara_import: "Envoyer un kara",
		karas: "Karas",
		tags: "Tags",
		login: "Se connecter",
		logout: "Se déconnecter"
	},
	modal: {
		login: {
			title: 'Se connecter',
			subtitle: 'Connectez-vous à votre compte en ligne pour voir vos favoris et éditer votre profil !',
			fields: {
				username: {
					label: 'Nom d\'utilisateur',
					placeholder: 'LoveLiveFan93'
				},
				password: {
					label: 'Mot de passe',
					placeholder: 'EnVraiJePréfèreIdolM@ster'
				}
			},
			submit: 'Se connecter'
		}
	}
}