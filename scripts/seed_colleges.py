import psycopg2
import os
import random
from dotenv import load_dotenv
import uuid

load_dotenv(override=True)

def seed_colleges():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found!")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Clear existing tables
        cur.execute("TRUNCATE TABLE \"Placement\" CASCADE")
        cur.execute("TRUNCATE TABLE \"Company\" CASCADE")
        cur.execute("TRUNCATE TABLE \"College\" CASCADE")
        
        # 1. Seed Comprehensive Pune Colleges List
        colleges_data = [
            # Tier 1
            ("College of Engineering Pune (COEP)", "Pune", "Maharashtra"),
            ("Pune Institute of Computer Technology (PICT)", "Pune", "Maharashtra"),
            ("Vishwakarma Institute of Technology (VIT)", "Pune", "Maharashtra"),
            ("Army Institute of Technology (AIT)", "Pune", "Maharashtra"),
            ("Defense Institute of Advanced Technology (DIAT)", "Pune", "Maharashtra"),
            # Tier 2
            ("MIT World Peace University (MIT-WPU)", "Pune", "Maharashtra"),
            ("Pimpri Chinchwad College of Engineering (PCCOE)", "Pune", "Maharashtra"),
            ("Cummins College of Engineering for Women", "Pune", "Maharashtra"),
            ("Symbiosis Institute of Technology (SIT)", "Pune", "Maharashtra"),
            ("Bharati Vidyapeeth College of Engineering (BVUCOE)", "Pune", "Maharashtra"),
            # Tier 3 (Strong Local Presence)
            ("Vishwakarma Institute of Information Technology (VIIT)", "Pune", "Maharashtra"),
            ("AISSMS College of Engineering", "Pune", "Maharashtra"),
            ("AISSMS Institute of Information Technology", "Pune", "Maharashtra"),
            ("Dr. D.Y. Patil Institute of Technology, Pimpri", "Pune", "Maharashtra"),
            ("Rajarshi Shahu College of Engineering", "Pune", "Maharashtra"),
            ("ZEAL College of Engineering & Research (ZCOER)", "Pune", "Maharashtra"),
            ("MIT Academy of Engineering (MITAOE)", "Pune", "Maharashtra"),
            ("Smt. Kashibai Navale College of Engineering", "Pune", "Maharashtra"),
            ("Nutan Maharashtra Institute of Engineering & Technology", "Pune", "Maharashtra"),
            ("Sinhgad College of Engineering (SCOE)", "Pune", "Maharashtra"),
            ("Indira College of Engineering and Management", "Pune", "Maharashtra"),
            ("Trinity College of Engineering and Research", "Pune", "Maharashtra")
        ]
        
        college_ids = {}
        for c in colleges_data:
            c_id = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO "College" (id, name, city, state)
                VALUES (%s, %s, %s, %s)
            """, (c_id, c[0], c[1], c[2]))
            college_ids[c[0]] = c_id

        # 2. Seed Realistic Companies
        companies_data = [
            # FAANG / Top Tier Product (Heavy Workload, Rare/Occasional)
            ("Google", "Product", "Heavy", "Rare", 35.0, ["Go", "Python", "Kubernetes", "Redis", "C++"]),
            ("Microsoft", "Product", "Heavy", "Occasional", 28.0, ["C#", "Azure", "TypeScript", "React", "SQL"]),
            ("Amazon", "Product", "Heavy", "Occasional", 25.0, ["AWS", "Java", "Python", "DynamoDB"]),
            ("Atlassian", "Product", "Moderate", "Rare", 30.0, ["Java", "React", "AWS", "Elasticsearch"]),
            ("Goldman Sachs", "Bank", "Heavy", "Rare", 24.0, ["Java", "C++", "Python", "MongoDB"]),
            
            # Unicorns / Indian High Growth Startups
            ("PhonePe", "Product", "Heavy", "Occasional", 24.0, ["Java", "Spring Boot", "Kafka", "Data Engineering"]),
            ("CRED", "Startup", "Heavy", "Rare", 25.0, ["Node.js", "React Native", "MongoDB"]),
            ("Groww", "Startup", "Heavy", "Occasional", 20.0, ["Java", "React", "Kafka"]),
            ("Paytm", "Startup", "Heavy", "Occasional", 16.0, ["Java", "Node.js", "MySQL"]),
            ("ElasticRun", "Startup", "Heavy", "Regular", 15.0, ["Python", "Django", "AWS"]),
            ("Avalara", "Product", "Moderate", "Occasional", 14.0, ["C#", "SQL", "Azure"]),
            
            # Mid-Tier Product Companies (Common in Pune)
            ("Druva", "Product", "Moderate", "Occasional", 18.0, ["Go", "Python", "AWS", "PostgreSQL"]),
            ("PubMatic", "Product", "Moderate", "Regular", 16.0, ["C++", "Python", "React", "Hadoop"]),
            ("Icertis", "Product", "Moderate", "Regular", 14.0, ["C#", "React", "Azure"]),
            ("FinIQ", "Product", "Heavy", "Regular", 12.0, ["Java", "SQL", "Angular"]),
            ("Bosch", "Product", "Moderate", "Regular", 9.0, ["C++", "Python", "Linux"]),
            ("Eaton", "Product", "Light", "Regular", 8.0, ["C#", "Python", "Pandas"]),
            ("Commvault", "Product", "Moderate", "Occasional", 18.5, ["C++", "Java", "Linux", "MongoDB"]),
            
            # Investment Banks & Fintech (Huge in Pune)
            ("Barclays", "Bank", "Moderate", "Regular", 15.0, ["Java", "Spring Boot", "SQL", "Jenkins"]),
            ("Credit Suisse", "Bank", "Moderate", "Occasional", 16.0, ["Java", "React", "Oracle"]),
            ("Mastercard", "Bank", "Moderate", "Occasional", 18.0, ["Java", "Angular", "Cybersecurity"]),
            ("BNY Mellon", "Bank", "Moderate", "Regular", 14.0, ["Java", "Python", "Linux", "React"]),
            ("Citi", "Bank", "Heavy", "Occasional", 16.5, ["Java", "Angular", "Redis"]),
            ("HSBC", "Bank", "Moderate", "Regular", 12.0, ["Java", "Spring Boot", "SQL"]),

            # Mass Recruiters / IT Services (Present literally everywhere)
            ("TCS (Ninja/Digital)", "Service", "Light", "Regular", 5.5, ["Java", "SQL", "JavaScript", "Python"]),
            ("Infosys", "Service", "Light", "Regular", 4.5, ["Python", "SQL", "Java", "AWS"]),
            ("Cognizant", "Service", "Light", "Regular", 4.5, ["Java", "SQL", "Angular", "Docker"]),
            ("Accenture", "Service", "Moderate", "Regular", 5.5, ["Java", "React", "AWS", "Azure"]),
            ("Capgemini", "Service", "Moderate", "Regular", 5.0, ["Java", "Angular", "SQL", "AWS"]),
            ("L&T Infotech (LTIMindtree)", "Service", "Moderate", "Regular", 6.0, ["Java", "React", "AWS", "Data Engineering"]),
            ("Wipro", "Service", "Light", "Regular", 4.0, ["Java", "SQL", "Linux"]),
            ("Tech Mahindra", "Service", "Light", "Regular", 4.0, ["Java", "Linux", "SQL"])
        ]

        company_ids = {}
        company_details = {}
        for c in companies_data:
            c_id = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO "Company" (id, name, category, workload, frequency)
                VALUES (%s, %s, %s, %s, %s)
            """, (c_id, c[0], c[1], c[2], c[3]))
            company_ids[c[0]] = c_id
            company_details[c[0]] = {"base_package": c[4], "skills": c[5], "frequency": c[3], "category": c[1]}

        # 3. Create Realistic Placement Mappings
        # Different colleges attract different tiers of companies
        
        tier1_colleges = ["College of Engineering Pune (COEP)", "Pune Institute of Computer Technology (PICT)", "Army Institute of Technology (AIT)"]
        tier2_colleges = ["Vishwakarma Institute of Technology (VIT)", "MIT World Peace University (MIT-WPU)", "Pimpri Chinchwad College of Engineering (PCCOE)", "Cummins College of Engineering for Women"]
        
        for college_name, college_id in college_ids.items():
            for comp_name, comp_id in company_ids.items():
                details = company_details[comp_name]
                add_company = False
                
                # Filtering logic based on real-world placement tiers in Pune
                if college_name in tier1_colleges:
                    # Tier 1 gets almost all product, unicorns, and banks.
                    # Service companies only visit for 'Digital' or high-tier profiles here.
                    add_company = True
                
                elif college_name in tier2_colleges:
                    # Tier 2 gets many product companies, most banks, and all services. Occasional FAANG (off-campus/rare).
                    if details["frequency"] in ["Regular", "Occasional"]:
                        add_company = True
                    # Sprinkle some rare ones occasionally for VIT/PCCOE
                    elif random.random() > 0.7: 
                        add_company = True
                        
                else:
                    # Tier 3 (remaining ones) primarily get IT Services, Mid-Tier Product, and some Banks.
                    if details["category"] == "Service":
                        add_company = True
                    elif details["frequency"] == "Regular":
                        add_company = True
                    # Small chance for Occasional Mid-Tier Product companies
                    elif details["frequency"] == "Occasional" and details["category"] != "Bank" and random.random() > 0.6:
                        add_company = True

                if add_company:
                    # Randomize package logically based on college brand value
                    pack_modifier = 1.0
                    if college_name in tier1_colleges:
                        pack_modifier = random.uniform(1.0, 1.15)
                    elif college_name in tier2_colleges:
                        pack_modifier = random.uniform(0.9, 1.05)
                    else:
                        pack_modifier = random.uniform(0.85, 0.95)

                    # Calculate final simulated average package
                    final_package = round(details["base_package"] * pack_modifier, 1)
                    
                    # For mass recruiters, lower tier colleges get standard 3.5-4LPA, top tiers get 6-7LPA (Digital profiles)
                    if details["category"] == "Service" and details["base_package"] < 6.0:
                        if college_name in tier1_colleges:
                            final_package = round(random.uniform(6.0, 7.5), 1)
                        if college_name not in tier1_colleges and college_name not in tier2_colleges:
                            final_package = round(random.uniform(3.5, 4.5), 1)

                    # Insert placement
                    cur.execute("""
                        INSERT INTO "Placement" (id, college_id, company_id, avg_package, top_skills)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (str(uuid.uuid4()), college_id, comp_id, final_package, details["skills"]))

        conn.commit()
        cur.close()
        conn.close()
        print("Successfully seeded ALL Pune Colleges and mapped realistic Placement data.")

    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    seed_colleges()
