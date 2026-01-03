# Syncs users TO Airtable from the local database.
# Pushes user data for external reporting/management.
class Airtable::UserSyncJob < Airtable::BaseSyncJob
  # @return [String] Airtable table name
  def table_name
    ENV.fetch("AIRTABLE_USERS_TABLE", "Users")
  end

  # @return [ActiveRecord::Relation] all User records
  def records
    User.all
  end

  # Maps User attributes to Airtable fields.
  # @param user [User] the user to map
  # @return [Hash] Airtable field values
  def field_mapping(user)
    {
      "Slack ID" => user.slack_id,
      "Slack Username" => user.slack_username,
      "Email" => user.email,
      "Projects" => user.projects,
      "Created At" => user.created_at&.iso8601
    }
  end
end