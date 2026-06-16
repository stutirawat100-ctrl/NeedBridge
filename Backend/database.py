# database.py — SQLite database setup for NeedBridge reviews
# Uses Flask-SQLAlchemy — simple, no separate DB server needed
# SQLite creates a local file 'needbridge.db' automatically

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Review(db.Model):
    __tablename__ = 'reviews'

    id          = db.Column(db.Integer, primary_key=True)
    ngo_id      = db.Column(db.String(100), nullable=False)   # e.g. "latika_roy_foundation"
    ngo_name    = db.Column(db.String(200), nullable=False)   # e.g. "Latika Roy Foundation"
    reviewer    = db.Column(db.String(100), nullable=False)   # name entered by user
    stars       = db.Column(db.Integer, nullable=False)       # 1 to 5
    review_text = db.Column(db.Text, nullable=False)          # written review
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id':          self.id,
            'ngo_id':      self.ngo_id,
            'ngo_name':    self.ngo_name,
            'reviewer':    self.reviewer,
            'stars':       self.stars,
            'review_text': self.review_text,
            'created_at':  self.created_at.strftime('%d %b %Y')
        }
