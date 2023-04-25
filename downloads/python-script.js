const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

module.exports = (refresh_token, userInfo) => {
    const date = new Date()
    const url = process.env.URL
    return `
# generated on ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} for ${userInfo.display_name} #

### do NOT share with anyone your private refresh_token ###
refresh_token = "${refresh_token}"

import requests # python3 -m pip install requests

request = requests.get(f'${url}refresh_token?refresh_token={refresh_token}&result=string')

if request.status_code != 200:
    print(f"Server responded with: '{request.text}'. Il refresh_token potrebbe non essere più valido. Genera un altro script su: '${url}python-script-download'")
    exit()

access_token = request.text

print(access_token)
    `
}