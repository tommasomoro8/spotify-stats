const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

module.exports = (refresh_token, userInfo) => {
    const date = new Date()
    const url = process.env.URL
    return `
# generated on ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} for ${userInfo.display_name} #

### do NOT share with anyone your private refresh_token ###
refresh_token = "${refresh_token}"

import requests # python3 -m pip install requests

access_token_request = requests.get(f'${url}refresh_token?refresh_token={refresh_token}&result=string')

if access_token_request.status_code != 200:
    print(f"Server responded with: '{access_token_request.text}'. Il refresh_token potrebbe non essere più valido. Genera un altro script su: '${url}python-script-download'")
    exit()

access_token = access_token_request.text

print(access_token)
    `
}

module.exports = (refresh_token, userInfo) => {
    const date = new Date()
    const url = process.env.URL
    return `

# generated on ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} for ${userInfo.display_name} #

### do NOT share with anyone your private refresh_token ###
refresh_token = "${refresh_token}"

import requests # python3 -m pip install requests
import turtle as t

access_token_request = requests.get(f'${url}refresh_token?refresh_token={refresh_token}&result=string')

if access_token_request.status_code != 200:
    print(f"Server responded with: '{access_token_request.text}'. Il refresh_token potrebbe non essere più valido. Genera un altro script su: 'http://localhost:3000/python-script-download'")
    exit()

access_token = 'Bearer  ' + access_token_request.text

time_range = 0 #4 weeks, 6 months, all
time_range_txt = ["short_term", "medium_term", "long_term"]

top_artists_request = requests.get(
    f'https://api.spotify.com/v1/me/top/artists?limit=50&time_range={time_range_txt[time_range]}',
    headers={
        "Content-Type": "application/json",
        'Authorization' : access_token
    })

if top_artists_request.status_code != 200:
    print(f"Server responded with: '{top_artists_request.text}'.")
    exit()

artists = top_artists_request.json()

if artists["total"] == 0:
    print("Non hai artisti preferiti")
    exit()

genres = []

for i in range(len(artists["items"])):
    for j in range(len(artists["items"][i]["genres"])):
        genres_contains_genre = False
        genere_index = 0

        for x in range(len(genres)):
            if genres[x]["genre"] == artists["items"][i]["genres"][j]:
                genres_contains_genre = True
                genere_index = x

        if not genres_contains_genre:
            genres.append({
                'genre': artists["items"][i]["genres"][j],
                'num': 1
            })
        else:
            genres[genere_index]["num"] += 1

genres = sorted(genres, key=lambda a: a['num'], reverse=True) 

display_genres = []

for i in range(len(genres)):
    if i >= 10:
        break
    display_genres.append(genres[i])
    display_genres[i]["genre"] = display_genres[i]["genre"].title()



maxnum = display_genres[0]["num"]
def widthLen(num):
    return (num * maxwidth) / maxnum

maxwidth = 200
column_height = 30
column_spacing = 10

totalHeight = column_height*len(display_genres) + column_spacing*(len(display_genres)-1)

window_padding = 150
window_width = maxwidth+(window_padding*2)
window_height = totalHeight+(window_padding*2)


t.setup(window_width+10, window_height+10)
t.screensize(window_width, window_height)
t.title("${userInfo.display_name}'s genres chart")
t.bgcolor("#111112")
t.speed(0)

t.penup()

t.right(90)
t.forward(totalHeight/2)
t.right(-90)
t.forward(-(maxwidth/2))

t.pendown()

t.showturtle()

def chart(width, text, height = column_height):
    t.pencolor("#162c23")
    t.pensize(3)
    t.fillcolor("#0ad769")
    t.begin_fill()
    t.penup()

    t.forward(-3)
    t.pencolor("white")
    t.write(text, font=('Arial', 15, 'normal'), align='right')
    t.pencolor("#162c23")
    t.forward(3)

    t.left(90)
    t.forward(height)
    t.left(-180)

    t.pendown()

    t.forward(height)
    t.left(90)

    t.forward(width)
    t.left(90)

    t.forward(height)
    t.left(90)

    t.forward(width)
    t.left(180)

    t.end_fill()

for i in range(len(display_genres)):
    chart(widthLen(display_genres[i]["num"]), display_genres[i]["genre"])
    if i < len(display_genres)-1:
        t.penup()

        t.left(90)
        t.forward(column_spacing)
        t.left(-90)

        t.pendown()


t.penup()

t.goto(-((window_width)/2)+15, ((window_height)/2)-50)
t.pencolor("white")
t.write("Spotify Stats", font=('Arial', 35, 'bold'), align='left')


t.goto(((window_width)/2)-15, -((window_height)/2)+15)
t.pencolor("#a3a3a3")
t.write("Script generated on ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} for ${userInfo.display_name}", font=('Arial', 12, 'bold'), align='right')

t.hideturtle()

t.done()
    `
}