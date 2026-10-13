import urllib.request
from lxml import html

BASE = 'https://w.atwiki.jp/edfwb2/'
def page(pid):
    url = BASE + ('pages/%s.html' % pid if pid else '')
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    soup = html.fromstring(urllib.request.urlopen(req, timeout=45).read())
    bodies = soup.xpath('//*[@id="wikibody"]')
    return soup, bodies[0] if bodies else None

if __name__ == '__main__':
    for pid in [72,147,190,63,188]:
        soup, body = page(pid)
        print('PAGE',pid,'BODY', body is not None)
        if body is None:
            print([(x.tag,x.get('id'),x.get('class')) for x in soup.xpath('//article|//main')])
            continue
        for table in body.xpath('.//table')[:3]:
            print('TABLE')
            for row in table.xpath('.//tr')[:8]:
                print([' '.join(c.text_content().split()) for c in row.xpath('./td|./th')])
        print('HEADINGS',[(x.tag,' '.join(x.text_content().split())) for x in body.xpath('.//h2|.//h3')][:25])
