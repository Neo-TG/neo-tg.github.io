// ==UserScript==
// @name         Altador Cup Score Fetcher
// @version      0.1
// @description  Writes scores to json file for Altater Cup and Ratville Scoreboard
// @author       Kat
// @match        *www.neopets.com/altador/colosseum/userstats.phtml?username=*
// @grant        GM.xmlHttpRequest
// @grant        GM_addElement
// @connect      api.github.com
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// ==/UserScript==

(function () {
        'use strict';

        // FIRST TIME USERS MUST FILL IN THESE DETAILS!!!!
        const SECRET_GITHUB_TOKEN = 'abcdefghijklmnopqrstuvwxyz1234567890'
        const MY_USERNAME = 'superkathiee'

// PLEASE POPULATE PLAYERS BY TEAM BELOW SEPARATED BY A COMMA AFTER THE QUOTATION MARK

        const STAR_PLAYERS = [
			"schwarzes_schaaf",
			"heroically",
			"uogy",
			"nostalgia",
			"bubble_gum_girl182",
			"athyx3",
			"riseofzedekiel",
			"tatyanne",
			"water_park1993",
			"cubscout30",
			"5552343",
			"amondina",
			"speed_e5",
			"m_hero18",
			"id_24",
			"catchinglights",
			"rotfljenn",
			"l_like_animals",
			"kailey_kitty1995",
			"16th_serendipity",
			"d_a_r_e",
			"heart_stealer292",
			"laura_ow08",
			"maivry",
			"rachael1410",
			"sweetrayofsunshine94",
			"roxi2rox",
			"cyberpuppy33",
			"not_sporty",
			"acherub",
			"sandralala",
			"sosunub",
			"lynnrules118108"
                    ]

        const MOON_PLAYERS = [
        
        ]

        const ALTATER_TEAMS = {
            "roo island": "Team Star",
            "krawk island": "Team Moon",
            "terror mountain": "Team Star",
            "shenkuu": "Team Moon",
            "altador": "Team Star",
            "lost desert": "Team Star",
            "haunted woods": "Team Moon",
            "darigan citadel": "Team Moon",
            "faerieland": "Team Star",
            "tyrannia": "Team Moon",
            "virtupets": "Team Moon",
            "mystery island": "Team Star",
            "kreludor": "Team Moon",
            "moltara": "Team Moon",
            "maraqua": "Team Star",
            "dacardia": "Team Star",
            "meridell": "Team Moon",
            "brightvale": "Team Star",
            "kiko lake": "Team Moon",
	"neopia central": "Team Star",
            "manually update": "Traitor Potaters"
        }

        const ALTATER_LOGOS = {
            "Team Star": "assets/teamstarb.png",
            "Team Moon": "assets/teammoonb.png",
            "Krelutarqua daMerivale": "https://imagizer.imageshack.com/img922/6522/hoKvtN.png",
            "Traitor Potaters": "https://images.neopets.com/games/betterthanyou/contestant101.gif"
        }

        const CLASSIC_LOGOS = {
            "roo island": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
            "krawk island": "https://images.neopets.com/altador/altadorcup/2010/popups/krawkisland/logo.png",
            "terror mountain": "https://images.neopets.com/altador/altadorcup/2010/popups/terrormountain/logo.png",
            "shenkuu": "https://images.neopets.com/altador/altadorcup/2010/popups/shenkuu/logo.png",
            "altador": "https://images.neopets.com/altador/altadorcup/2010/popups/altador/logo.png",
            "lost desert": "https://images.neopets.com/altador/altadorcup/2010/popups/lostdesert/logo.png",
            "haunted woods": "https://images.neopets.com/altador/altadorcup/2010/popups/hauntedwoods/logo.png",
            "darigan citadel": "https://images.neopets.com/altador/altadorcup/2010/popups/darigancitadel/logo.png",
            "faerieland": "https://images.neopets.com/altador/altadorcup/2010/popups/faerieland/logo.png",
            "tyrannia": "https://images.neopets.com/altador/altadorcup/2010/popups/tyrannia/logo.png",
            "virtupets": "https://images.neopets.com/altador/altadorcup/2010/popups/virtupets/logo.png",
            "mystery island": "https://images.neopets.com/altador/altadorcup/2010/popups/mysteryisland/logo.png",
            "kreludor": "https://images.neopets.com/altador/altadorcup/2010/popups/kreludor/logo.png",
            "moltara": "https://images.neopets.com/altador/altadorcup/2010/popups/moltara/logo.png",
            "maraqua": "https://images.neopets.com/altador/altadorcup/2010/popups/maraqua/logo.png",
            "dacardia": "https://images.neopets.com/altador/altadorcup/2010/popups/dacardia/logo.png",
            "meridell": "https://images.neopets.com/altador/altadorcup/2010/popups/meridell/logo.png",
            "brightvale": "https://images.neopets.com/altador/altadorcup/2010/popups/brightvale/logo.png",
            "kiko lake": "https://images.neopets.com/altador/altadorcup/2010/popups/kikolake/logo.png",
	"neopia central": "https://file.garden/aTZekCJbkUlB56gX/Tomodachi/stk_team_neopiacentral.png",
            "manually update": "https://file.garden/aTZekCJbkUlB56gX/Tomodachi/stk_team_neopiacentral.png"
        }

        const data = {};

        // Get level
        const h2Text = document.querySelector('.team-title h2').textContent.trim().toLowerCase();
        if (h2Text === 'your stats') {
            data.username = MY_USERNAME;
        } else {
            data.username = h2Text;
        }

        if (STAR_PLAYERS.includes(data.username) || MOON_PLAYERS.includes(data.username)) {
            data.rank = document.querySelector('.team-title p').textContent.trim();

            const team_title_html = document.querySelector('.team-title').innerHTML;
            const teamNameMatch = team_title_html.match(/<!--<div class="team-name">([^<]+)<\/div>-->/);
            if (teamNameMatch) {
                data.team_name = teamNameMatch[1].trim().toLowerCase();
            } else {
                data.team_name = "manually update"
            }

            // Get Yooyuball stats
            const yybSection = document.querySelector('section.gamestats:nth-of-type(1)');
            data.yyb_goals_scored = parseInt(yybSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));
            data.yyb_wins = parseInt(yybSection.querySelector('li:nth-of-type(7) span').textContent.trim().replace(/,/g, ''));
            data.yyb_draws = parseInt(yybSection.querySelector('li:nth-of-type(8) span').textContent.trim().replace(/,/g, ''));

            // Get Slushie Slinger stats
            const slsSection = document.querySelector('section.gamestats:nth-of-type(2)');
            data.slsl_games_played = parseInt(slsSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));
            data.slsl_top_score = parseInt(slsSection.querySelector('li:nth-of-type(2) span').textContent.trim().replace(/,/g, ''));

            // Get Make Some Noise stats
            const msnSection = document.querySelector('section.gamestats:nth-of-type(3)');
            data.msn_games_played = parseInt(msnSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));
            data.msn_top_score = parseInt(msnSection.querySelector('li:nth-of-type(2) span').textContent.trim().replace(/,/g, ''));

            // Get Shootout Showdown stats
            const sosdSection = document.querySelector('section.gamestats:nth-of-type(4)');
            data.sosd_games_played = parseInt(sosdSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));
            data.sosd_top_score = parseInt(sosdSection.querySelector('li:nth-of-type(2) span').textContent.trim().replace(/,/g, ''));

			// Get Obstacle Course Caper stats
            const occSection = document.querySelector('section.gamestats:nth-of-type(5)');
            data.occ_games_played = parseInt(occSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));
            data.occ_top_score = parseInt(occSection.querySelector('li:nth-of-type(2) span').textContent.trim().replace(/,/g, ''));

            // Get current timestamp
            const timestamp = new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'});

            // Helper function to make HTTP requests with GM.xmlHttpRequest
            function gmXhrRequest(method, fileName, data) {
                let url = `https://api.github.com/repos/neo-tg/neo-tg.github.io/contents/${fileName}`
                let headers = {
                    Authorization: `token ${SECRET_GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json'
                }
                return new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: method,
                        url: url,
                        headers: headers,
                        data: data,
                        onload: (response) => resolve(response),
                        onerror: (error) => reject(error)
                    });
                });
            }

            function removeByUsername(scores, username) {
                const index = scores.findIndex(entry => entry.username === username);
                if (index !== -1) {
                    scores.splice(index, 1);
                    console.log(`Removed user ${username}, will append stats`);
                } else {
                    console.log(`User ${username} not found, will add from scratch`);
                }
                return scores;
            }

            function updateScores(fileName, data, logos, teamName) {
                return gmXhrRequest('GET', fileName).then(response => {
                    const responseData = JSON.parse(response.responseText);
                    const gitSha = responseData.sha;
                    const scores = JSON.parse(atob(responseData.content));
                    removeByUsername(scores, data.username);

                    const total_score = (data.yyb_wins * 14) + (data.slsl_games_played * 10) + (data.msn_games_played * 3) + (data.sosd_games_played * 3) + (data.occ_games_played * 5);

                    scores.push({
                        "team_logo": logos[teamName],
                        "team_name": teamName,
                        "username": data.username,
                        "yyb_wins": data.yyb_wins,
                        "yyb_draws": data.yyb_draws,
                        "yyb_high_score": data.yyb_goals_scored,
                        "slsl_wins": data.slsl_games_played,
                        "slsl_high_score": data.slsl_top_score,
                        "msn_plays": data.msn_games_played,
                        "msn_high_score": data.msn_top_score,
                        "sosd_plays": data.sosd_games_played,
                        "sosd_high_score": data.sosd_top_score,
						"occ_plays": data.occ_games_played,
						"occ_high_score": data.occ_top_score,
                        "total_score": total_score,
                        "last_updated": timestamp
                    });

                    const fileContent = JSON.stringify(scores, null, 2);
                    const base64Content = btoa(unescape(encodeURIComponent(fileContent)));

                    const updateData = {
                        message: `Update scores.json for ${data.username} in ${fileName} at ${timestamp} NST`,
                        content: base64Content,
                        branch: `main`,
                        sha: gitSha
                    };
                    return gmXhrRequest('PUT', fileName, JSON.stringify(updateData)).then(response => {
                        console.log(`Updated successfully for ${data.username} in ${fileName}`, JSON.parse(response.responseText));
                    }).catch(error => {
                        console.error('Error updating file:', error.response ? JSON.parse(error.responseText) : error.message);
                    });
                });
            }

            const updateIfParticipant = async () => {
                if (STAR_PLAYERS.includes(data.username)) {
                    await updateScores('star_scores.json', data, CLASSIC_LOGOS, data.team_name);
                }
                if (MOON_PLAYERS.includes(data.username)) {
                    await updateScores('moon_scores.json', data, CLASSIC_LOGOS, data.team_name);
                }
            };
            updateIfParticipant().catch(error => console.error('Error in updateIfParticipant:', error));

        } else {
            console.log(`User ${data.username} is not a participant in the Tomodachi World Cup`)
        }
    }
)
();
