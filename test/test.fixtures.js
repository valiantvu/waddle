var fixtures = {};

fixtures.testPlace = {
  'name': 'name',
  'lat': 0,
  'lng': 1,
  'checkinTime': 'null',
  'likes': 'null',
  'photos': 'null',
  'caption': 'null',
  'foursquareID': 'null',
  'country': 'null',
  'category': 'null'
};

fixtures.testUser = {
  facebookID: 123456789,
  name: "Testy McTest"
}

fixtures.IGdata = {
    "data": [{
        "location": {
            "id": "833",
            "latitude": 37.77956816727314,
            "longitude": -122.41387367248539,
            "name": "Civic Center BART"
        },
        "comments": {
            "count": 16,
            "data": ['...']
        },
        "caption": null,
        "link": "http://instagr.am/p/BXsFz/",
        "likes": {
            "count": 190,
            "data": [{
                "username": "shayne",
                "full_name": "Shayne Sweeney",
                "id": "20",
                "profile_picture": "..."
            }, {}]
        },
        "created_time": "1296748524",
        "images": {
            "low_resolution": {
                "url": "http://distillery.s3.amazonaws.com/media/2011/02/03/efc502667a554329b52d9a6bab35b24a_6.jpg",
                "width": 306,
                "height": 306
            },
            "thumbnail": {
                "url": "http://distillery.s3.amazonaws.com/media/2011/02/03/efc502667a554329b52d9a6bab35b24a_5.jpg",
                "width": 150,
                "height": 150
            },
            "standard_resolution": {
                "url": "http://distillery.s3.amazonaws.com/media/2011/02/03/efc502667a554329b52d9a6bab35b24a_7.jpg",
                "width": 612,
                "height": 612
            }
        },
        "type": "image",
        "users_in_photo": [],
        "filter": "Earlybird",
        "tags": [],
        "id": "22987123",
        "user": {
            "username": "kevin",
            "full_name": "Kevin S",
            "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_3_75sq_1295574122.jpg",
            "id": "3"
        }
    }]
}


module.exports = fixtures;