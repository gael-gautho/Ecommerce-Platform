# -*- coding: utf-8 -*-

import django
import os
import sys
from django.db import connection

sys.path.append(os.path.join(os.path.abspath(os.path.dirname(__file__)), '..'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_backend.settings")
django.setup()

def drop_order_tables():
    """Supprime complètement les tables Order et OrderItem"""
    
    with connection.cursor() as cursor:
        try:
            print("=== Suppression des tables ===")
            
            # Désactivez les contraintes FK
            try:
                cursor.execute("PRAGMA foreign_keys = OFF")  # SQLite
            except:
                try:
                    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")  # MySQL
                except:
                    pass  # PostgreSQL
            
            # Supprimez les tables (OrderItem d'abord à cause des FK)
            cursor.execute("DROP TABLE IF EXISTS order_orderitem")
            print("✅ Table order_orderitem supprimée")
            
            cursor.execute("DROP TABLE IF EXISTS order_order")
            print("✅ Table order_order supprimée")
            
            # Réactivez les contraintes FK
            try:
                cursor.execute("PRAGMA foreign_keys = ON")  # SQLite
            except:
                try:
                    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")  # MySQL
                except:
                    pass
                    
            print("=== Tables supprimées avec succès ===")
            
        except Exception as e:
            print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    drop_order_tables()