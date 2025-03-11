import numpy as np

# Define the annual interest rate and convert it to a daily rate
annual_interest_rate = 5.50 / 100
daily_interest_rate = annual_interest_rate / 365

# Updated number of days in each month from July 2, 2024, to June 30, 2025
updated_days_in_month = {
    "July 2024": 30,  # Starting from July 2, 2024
    "August 2024": 31,
    "September 2024": 30,
    "October 2024": 31,
    "November 2024": 30,
    "December 2024": 31,
    "January 2025": 31,
    "February 2025": 28,
    "March 2025": 31,
    "April 2025": 30,
    "May 2025": 31,
    "June 2025": 30,
}

# Function to calculate monthly savings with daily increase and interest
def calculate_monthly_savings(month_days, start_day):
    daily_savings = np.arange(start_day, start_day + month_days)
    daily_balances = np.cumsum(daily_savings)
    daily_interest = daily_balances * daily_interest_rate
    total_interest = np.sum(daily_interest)
    total_savings = np.sum(daily_savings) + total_interest
    return total_savings, total_interest

# Initialize variables for the updated period
updated_results = {}
start_day = 2  # Starting from July 2, 2024
updated_total_savings = 0
updated_total_interest = 0

# Calculate savings and interest for each updated month
for month, days in updated_days_in_month.items():
    month_savings, month_interest = calculate_monthly_savings(days, start_day)
    updated_results[month] = {
        "total_savings": month_savings,
        "total_interest": month_interest,
    }
    start_day += days
    updated_total_savings += month_savings
    updated_total_interest += month_interest

# Print the results
for month, data in updated_results.items():
    print(f"{month}: Total Savings = ${data['total_savings']:.2f}, Total Interest = ${data['total_interest']:.2f}")

print(f"\nTotal Savings Over the Year: ${updated_total_savings:.2f}")
print(f"Total Interest Over the Year: ${updated_total_interest:.2f}")
