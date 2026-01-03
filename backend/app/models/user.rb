# Represents a user in the system, synced TO Airtable.
class User < ApplicationRecord
  has_many :shop_orders, dependent: :destroy

  # Checks if user has completed IDV verification.
  # @return [Boolean] true if verified
  def idv_verified?
    idv_verified == true
  end
end